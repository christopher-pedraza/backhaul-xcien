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
  }>;
  sink: string;
  source: string;
  incomingFlow: Record<string, number>;
  totalInflow: number;
}

export interface FlowSolution {
  flows: Array<{ from: string; to: string; flow: number }>;
  totalCost: number;
}

export const useFlowSolver = () => {
  const [solution, setSolution] = useState<FlowSolution>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const edges: Graph["edges"] = []

    for (const edge of cyEdges) {
      const source = edge.source().id();
      const target = edge.target().id();
      const capacity = Number(edge.data("capacity") || 10); // Default capacity if not specified

      if (!sinks.includes(source)) {
        edges.push({ from: source, to: target, capacity, strictCapacity: false });
      }

      if (!sinks.includes(target)) {
        edges.push({ from: target, to: source, capacity, strictCapacity: false });
      }
    }

    // cyEdges.map((edge) => ({
    //   from: edge.source().id(),
    //   to: edge.target().id(),
    //   capacity: Number(edge.data("capacity") || 10), // Default capacity if not specified
    // }));


    const superSink = "sink";
    const superSource = "source";
    nodes.push(superSink, superSource);
    edges.push(
      ...sinks.map((sink) => ({
        from: sink,
        to: superSink,
        capacity: totalInflow,
        strictCapacity: true,
      })),
      ...sources.map((source) => ({
        from: superSource,
        to: source,
        capacity: incomingFlow[source],
        strictCapacity: true,
      }))
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

  const computeFlow = useCallback(async (alpha = 0.7) => {
    setLoading(true);
    setError(null);

    if (!graph?.cy) {
      throw new Error("No graph available");
    }

    const graphData = buildGraphFromCy();
    const glpk = await GLPK();
    // const alpha = 0.7; // Or make this configurable
    const { nodes, edges, totalInflow, sink, source, incomingFlow } = graphData;

    console.log("---------")
    console.log("Graph data:");
    console.log("Nodes:", nodes);
    console.log("Edges:", edges);
    console.log("Total Inflow:", totalInflow);
    console.log("-----");


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
        lp.objective!.vars.push({ name: fName, coef: alpha });
      } 
      else {
        // For regular edges, use the overflow variable approach
        const oName = `o_${from}->${to}`;
        
        lp.bounds!.push({
          name: oName,
          type: glpk.GLP_LO,
          lb: 0,
          ub: Infinity,
        });

        lp.objective!.vars.push({ name: fName, coef: alpha });
        lp.objective!.vars.push({ name: oName, coef: 1 - alpha });

        // Overflow constraint: f - o ≤ c
        lp.subjectTo!.push({
          name: `overflow_${from}->${to}`,
          vars: [
            { name: fName, coef: 1 },
            { name: oName, coef: -1 },
          ],
          bnds: { type: glpk.GLP_UP, ub: capacity, lb: 0 },
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
      } else if (v == source) {
        // const flow = incomingFlow[v];
        lp.subjectTo!.push({
          name: `flow_${v}`,
          vars: [...inflow, ...outflow],
          bnds: { type: glpk.GLP_FX, lb: -totalInflow, ub: -totalInflow },
        });
      } else {
        lp.subjectTo!.push({
          name: `flow_${v}`,
          vars: [...inflow, ...outflow],
          bnds: { type: glpk.GLP_FX, lb: 0, ub: 0 },
        });
      }
    }

    const sourceEdges = edges
      .filter((e) => e.from === source)
    console.log("Source edges:", sourceEdges);

    // Solve the LP
    const result = await glpk.solve(lp, { msglev: glpk.GLP_MSG_ERR });
    console.log("Result:");
    console.log(result.result);
    console.log("---------");

    if (result.result.status !== glpk.GLP_OPT) {
      throw new Error("No optimal flow found");
    }

    // Extract flows
    const flows: FlowSolution["flows"] = edges
      .map(({ from, to }) => {
        const fName = `f_${from}->${to}`;
        return {
          from,
          to,
          flow: result.result.vars[fName] ?? 0,
        };
      })
      .filter((f) => f.flow > 1e-6); // Filter near-zero flows

    const totalCost = result.result.z;

    const solution: FlowSolution = { flows, totalCost };
    setSolution(solution);
    setLoading(false);

    return solution;
  //   } catch (err) {
  //     const errorMessage = err instanceof Error ? err.message : "Unknown error";
  //     setError(errorMessage);
  //     console.error("Flow calculation error:", err);
  //     return [];
  //   } finally {
  //     setLoading(false);
  //   }
  }, [graph, buildGraphFromCy]);

  useEffect(() => {
    if (!solution || !graph?.cy) return;

    const cy = graph.cy;
    console.log("Updating graph with solution...");
    console.log("Solution flows:");
    console.log(solution.flows);
    console.log(cy.edges().data());

    // Apply the flow values as usage
    for (const { from, to, flow } of solution.flows) {
      const edge1 = cy.edges(`[source="${from}"][target="${to}"]`);
      const edge2 = cy.edges(`[source="${to}"][target="${from}"]`);

      if (edge1.length > 0) {
        edge1.data("usage", flow);
      } else if (edge2.length > 0) {
        edge2.data("usage", flow);
      }
    }

    // Update the visualization
    cy.style().update();
  }, [solution, graph?.cy]); // Only run when solution or cy changes

  // const changeGraph = useCallback(() => {
  //   if (!graph?.cy) {
  //     throw new Error("Cytoscape instance not available");
  //   }

  //   if (!solution) {
  //     throw new Error("No solution available");
  //   }

  //   const cy = graph.cy;

  //   // Apply the flow values as usage
  //   for (const { from, to, flow } of solution.flows) {
  //     // Find the corresponding edge in the cytoscape graph
  //     const edge = cy.edges(`[source="${from}"][target="${to}"]`);

  //     if (edge.length === 0) {
  //       continue
  //     }

  //     edge.data("usage", flow);
  //   }

  //   // Update the visualization
  //   cy.style().update();

  // }, [solution]);

  return {
    solution,
    loading,
    error,
    computeFlow,
    // changeGraph,
  };
};
