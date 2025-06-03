import { RtdbEdges } from "@/converters/edge";
import { RtdbNodes } from "@/converters/node";
import { CytoscapeOptions } from "cytoscape";

export const splitElements = (
  elements: CytoscapeOptions["elements"] = [],
): { nodes: RtdbNodes; edges: RtdbEdges } => {
  const nodes: RtdbNodes = {};
  const edges: RtdbEdges = {};

  (Array.isArray(elements) ? elements : []).forEach((el: any) => {
    if (el.type === "node") {
      const { id, name, clients = [] } = (el as any).data ?? {};
      const { x = 0, y = 0 } = (el as any).position ?? {};
      nodes[id] = {
        name: name ?? id,
        x,
        y,
        type: (el as any).classes ?? "",
        // adapta este bloque si quieres persistir clientes
        ...(clients.length && {
          clients: Object.fromEntries(
            clients.map((c: any) => [c.id, { name: c.name }]),
          ),
        }),
      };
    } else if (el.type === "edge") {
      const { id, source, target, capacity = 0, usage = 0 } = (el as any).data;
      edges[id] = { source, target, capacity, usage };
    }
  });

  return { nodes, edges };
};
