import { Topology } from "@/types/Topology";
import { get, ref } from "firebase/database";
import { rtdb } from "@/firebaseConfig";
import { CytoscapeOptions } from "cytoscape";
import { edgesConverter } from "@/converters/edge";
import { nodesConverter } from "@/converters/node";


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

    options.push({ id, name });
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
  const nodeElements: CytoscapeOptions["elements"] = nodesConverter(nodes);

  // convert the edges
  const edgeElements: CytoscapeOptions["elements"] = edgesConverter(edges);

  return {
    id,
    elements: [...nodeElements, ...edgeElements],
  };
};
