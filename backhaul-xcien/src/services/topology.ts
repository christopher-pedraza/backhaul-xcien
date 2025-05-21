import { Topology } from "@/types/Topology";
import { get, ref } from "firebase/database";
import { rtdb } from "@/firebaseConfig";
import { CytoscapeOptions } from "cytoscape";


interface TopologyOption {
  id: string;
  name: string;
}

export const getTopologyOptions = async (): Promise<TopologyOption[]> => {
  const snap = await get(ref(rtdb, "topologyIndex"));

  const options: TopologyOption[] = [];
  console.log(snap);
  snap.forEach((c) => {
    const id = c.key;
    if (!id) return;

    const name = c.val() as string;

    options.push({ id, name })
  });

  return options;
};

export const getTopologyById = async (id: string): Promise<Topology> => {
  const snap = await get(ref(rtdb, `topologies/${id}`));

  if (!snap.exists()) {
    throw new Error(`Topology "${id}" not found`);
  }

  const { nodes = {}, edges = {} } = snap.val();

  // convert the nodes
  const nodeElements: CytoscapeOptions["elements"] = Object.entries(nodes).map(
    ([nodeId, node]: any) => ({
      data: {
        id: nodeId,
        name: node.name,
        clients: node.clients ?? {},
      },
      position: { x: node.x, y: node.y },
      classes: node.type,
    }),
  );

  // convert the edges
  const edgeElements: CytoscapeOptions["elements"] = Object.entries(edges).map(
    ([edgeId, edge]: any) => ({
      data: {
        id: edgeId,
        source: edge.source,
        target: edge.target,
        capacity: edge.capacity,
        usage: edge.usage
      },
    }),
  );

  return {
    id,
    elements: [...nodeElements, ...edgeElements],
  };
};
