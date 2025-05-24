import { useState, useCallback, useEffect } from "react";
import { useCyContext } from "@/hooks/useCyContext";
import GLPK, { LP } from "glpk.js";

export interface Graph {
  nodes: string[];
  edges: Array<{
    from: string;
    to: string;
    capacity: number;
    strictCapacity: boolean;
    edgeId: string;
  }>;
  sink: string;
  source: string;
  incomingFlow: Record<string, number>;
  totalInflow: number;
}

export interface SimulationRecommendation {
  edgeId: string;
  prevUsage: number;
  newUsage: number;
  capacity: number;
}

export const useFlowSolver = () => {
  const [solution, setSolution] = useState<SimulationRecommendation[]>();
  const [loading, setLoading] = useState(false);

  const graph = useCyContext();

  const buildGraphFromCy = useCallback(() => {
    if (!graph?.cy) {
      throw new Error("Cytoscape instance not available");
    }

    const cyNodes = graph.cy.nodes();
    const cyEdges = graph.cy.edges();

    // Determine sinks
    const sinks: string[] = [];
    cyNodes.forEach((node) => {
      if (node.hasClass("cloud")) {
        sinks.push(node.id());
      }
    });

    let totalInflow = 0;
    const sources: string[] = [];
    const incomingFlow: Record<string, number> = {};

    cyNodes.forEach((node) => {
      let nodeDemand = 0;

      for (const client of node.data("clients")) {
        nodeDemand += Number(client.usage);
      }

      totalInflow += nodeDemand;

      if (nodeDemand > 0) {
        sources.push(node.id());
        incomingFlow[node.id()] = nodeDemand;
      }
    });

    const nodes: string[] = cyNodes.map((node) => node.id());
    const edges: Graph["edges"] = [];

    for (const edge of cyEdges) {
      const source = edge.source().id();
      const target = edge.target().id();
      const capacity = Number(edge.data("capacity") || 10); // Default capacity if not specified

      if (!sinks.includes(source)) {
        edges.push({
          from: source,
          to: target,
          capacity,
          edgeId: edge.id(),
          strictCapacity: false,
        });
      }

      if (!sinks.includes(target)) {
        edges.push({
          from: target,
          to: source,
          capacity,
          edgeId: edge.id(),
          strictCapacity: false,
        });
      }
    }

    const superSink = "sink";
    const superSource = "source";
    nodes.push(superSink, superSource);
    edges.push(
      ...sinks.map((sink) => ({
        from: sink,
        to: superSink,
        capacity: totalInflow,
        edgeId: `${sink}->${superSink}`,
        strictCapacity: true,
      })),
      ...sources.map((source) => ({
        from: superSource,
        to: source,
        capacity: incomingFlow[source],
        edgeId: `${superSource}->${source}`,
        strictCapacity: true,
      })),
    );

    return {
      nodes,
      edges,
      sink: superSink,
      source: superSource,
      incomingFlow,
      totalInflow,
    } as Graph;
  }, [graph]);

  const computeFlow = useCallback(
    async (jump_weight = 0.5) => {
      setLoading(true);

      if (!graph?.cy) {
        throw new Error("No graph available");
      }

      const graphData = buildGraphFromCy();
      const glpk = await GLPK();
      const { nodes, edges, totalInflow, sink, source } = graphData;

      // console.log("---------");
      // console.log("Graph data:");
      // console.log("Nodes:", nodes);
      // console.log("Edges:", edges);
      // console.log("Total Inflow:", totalInflow);
      // console.log("-----");

      const lp: LP = {
        name: "flow-lp",
        objective: {
          direction: glpk.GLP_MIN,
          name: "total_cost",
          vars: [],
        },
        bounds: [],
        subjectTo: [],
      };

      // Add variables and objective terms
      for (const { from, to, capacity, strictCapacity } of edges) {
        const fName = `f_${from}->${to}`;

        // Add flow variable
        lp.bounds!.push({
          name: fName,
          type: glpk.GLP_LO,
          lb: 0,
          ub: Infinity,
        });

        if (strictCapacity) {
          // For edges that cannot exceed capacity, just add a direct upper bound constraint
          lp.subjectTo!.push({
            name: `capacity_${from}->${to}`,
            vars: [{ name: fName, coef: 1 }],
            bnds: { type: glpk.GLP_UP, ub: capacity, lb: 0 },
          });

          // Add to objective function (no overflow term)
          lp.objective!.vars.push({ name: fName, coef: jump_weight });
        } else {
          // For regular edges, use the overflow variable approach
          const oName = `o_${from}->${to}`;

          lp.bounds!.push({
            name: oName,
            type: glpk.GLP_LO,
            lb: 0,
            ub: Infinity,
          });

          lp.objective!.vars.push({ name: fName, coef: jump_weight });
          lp.objective!.vars.push({ name: oName, coef: 1 - jump_weight });

          // Overflow constraint: f - o ≤ c
          let upperbound = capacity;
          if (upperbound > 500) {
            upperbound *= 0.8;
          } else {
            upperbound *= 0.5;
          }
          lp.subjectTo!.push({
            name: `overflow_${from}->${to}`,
            vars: [
              { name: fName, coef: 1 },
              { name: oName, coef: -1 },
            ],
            bnds: { type: glpk.GLP_UP, ub: upperbound, lb: 0 },
          });
        }
      }

      // Add flow conservation for non-sink/non-source nodes
      for (const v of nodes) {
        if (v === source) continue;

        const inflow = edges
          .filter((e) => e.to === v)
          .map((e) => ({ name: `f_${e.from}->${e.to}`, coef: 1 }));

        const outflow = edges
          .filter((e) => e.from === v)
          .map((e) => ({ name: `f_${e.from}->${e.to}`, coef: -1 }));

        if (v == sink) {
          lp.subjectTo!.push({
            name: `flow_${v}`,
            vars: [...inflow, ...outflow],
            bnds: { type: glpk.GLP_FX, lb: totalInflow, ub: totalInflow },
          });
        } else {
          lp.subjectTo!.push({
            name: `flow_${v}`,
            vars: [...inflow, ...outflow],
            bnds: { type: glpk.GLP_FX, lb: 0, ub: 0 },
          });
        }
      }

      // Solve the LP
      const result = await glpk.solve(lp, { msglev: glpk.GLP_MSG_ERR });
      // console.log("Result:");
      // console.log(result.result);
      // console.log("---------");

      if (result.result.status !== glpk.GLP_OPT) {
        throw new Error("No optimal flow found");
      }

      const recommendations: Record<string, SimulationRecommendation> = {};

      for (const { from, to, capacity, edgeId } of edges) {
        if (from === source || to === sink) {
          continue; // Skip source and sink edges
        }

        let edge = graph.cy.edges(`[id="${edgeId}"]`);
        let varName1 = `f_${from}->${to}`;
        let varName2 = `f_${to}->${from}`;
        const data = edge.data();
        const recomm: SimulationRecommendation = {
          edgeId: data.id,
          prevUsage: data.usage || 0,
          newUsage:
            (result.result.vars[varName1] || 0) +
            (result.result.vars[varName2] || 0),
          capacity,
        };

        recommendations[edgeId] = recomm;
      }

      setSolution(Object.values(recommendations));
      setLoading(false);

      return Object.values(recommendations);
    },
    [graph, buildGraphFromCy],
  );

  useEffect(() => {
    if (!solution || !graph?.cy) return;

    const cy = graph.cy;

    // Apply the flow values as usage
    for (const recomm of solution) {
      const edge = cy.edges(`[id="${recomm.edgeId}"]`);

      if (edge.length > 0) {
        edge.data("usage", recomm.newUsage);
      }
    }

    // Update the visualization
    cy.style().update();
  }, [solution, graph?.cy]); // Only run when solution or cy changes

  return {
    solution,
    loading,
    computeFlow,
  };
};
