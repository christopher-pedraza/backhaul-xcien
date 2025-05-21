import { useState, useCallback, useEffect } from "react";
import { useCyContext } from "@/hooks/useCyContext";
import GLPK, { LP } from "glpk.js";

export interface Graph {
  nodes: string[];
  edges: Array<{ from: string; to: string; capacity: number }>;
  demands: Record<string, number>; // d[v]
  sinks: string[];
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

    const nodes: string[] = cyNodes.map((node) => node.id());
    const edges: Graph["edges"] = cyEdges.map((edge) => ({
      from: edge.source().id(),
      to: edge.target().id(),
      capacity: Number(edge.data("capacity") || 10), // Default capacity if not specified
    }));

    // This is a simplified example - you'll need to determine how demands are stored in your nodes
    const demands: Record<string, number> = {};
    cyNodes.forEach((node) => {
      let nodeDemand = 0;

      for (const client of node.data("clients")) {
        nodeDemand += Number(client.usage);
      }

      demands[node.id()] = nodeDemand;
    });

    // Determine sinks
    const sinks: string[] = [];
    cyNodes.forEach((node) => {
      if (node.hasClass("cloud")) {
        sinks.push(node.id());
      }
    });

    return {
      nodes,
      edges,
      demands,
      sinks,
    } as Graph;
  }, [graph]);

  const computeFlow = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!graph?.cy) {
        throw new Error("No graph available");
      }

      const graphData = buildGraphFromCy();

      const glpk = await GLPK();
      const alpha = 0.7; // Or make this configurable
      const { nodes, edges, demands, sinks } = graphData;

      // Create directed edges (both directions)
      const directedEdges = edges.flatMap(({ from, to, capacity }) => [
        { from, to, capacity },
        { from: to, to: from, capacity },
      ]);

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
      for (const { from, to, capacity } of directedEdges) {
        const fName = `f_${from}->${to}`;
        const oName = `o_${from}->${to}`;

        lp.bounds!.push({
          name: fName,
          type: glpk.GLP_LO,
          lb: 0,
          ub: Infinity,
        });
        lp.bounds!.push({
          name: oName,
          type: glpk.GLP_LO,
          lb: 0,
          ub: Infinity,
        });

        lp.objective!.vars.push({ name: fName, coef: alpha });
        lp.objective!.vars.push({ name: oName, coef: 1 - alpha });

        // Overflow constraint: f - o ≤ c  ⇨ f - o - s ≤ c
        lp.subjectTo!.push({
          name: `overflow_${from}->${to}`,
          vars: [
            { name: fName, coef: 1 },
            { name: oName, coef: -1 },
          ],
          bnds: { type: glpk.GLP_UP, ub: capacity, lb: -Infinity },
        });
      }

      // Add flow conservation for non-sink nodes
      for (const v of nodes) {
        if (sinks.includes(v)) continue;

        const inflow = directedEdges
          .filter((e) => e.to === v)
          .map((e) => ({ name: `f_${e.from}->${e.to}`, coef: 1 }));

        const outflow = directedEdges
          .filter((e) => e.from === v)
          .map((e) => ({ name: `f_${e.from}->${e.to}`, coef: -1 }));

        const demand = demands[v] ?? 0;

        lp.subjectTo!.push({
          name: `flow_${v}`,
          vars: [...inflow, ...outflow],
          bnds: { type: glpk.GLP_FX, lb: demand, ub: demand },
        });
      }

      // Solve the LP
      const result = await glpk.solve(lp, { msglev: glpk.GLP_MSG_ERR });
      console.log(result.result);

      if (result.result.status !== glpk.GLP_OPT) {
        throw new Error("No optimal flow found");
      }

      // Extract flows
      const flows: FlowSolution["flows"] = directedEdges
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

      return [solution];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Flow calculation error:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [graph, buildGraphFromCy]);

  useEffect(() => {
    if (!solution || !graph?.cy) return;

    const cy = graph.cy;

    // Apply the flow values as usage
    for (const { from, to, flow } of solution.flows) {
      const edge = cy.edges(`[source="${from}"][target="${to}"]`);

      if (edge.length === 0) continue;

      edge.data("usage", flow);
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
