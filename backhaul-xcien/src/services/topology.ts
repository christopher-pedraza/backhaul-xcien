import { Topology } from "@/types/Topology";
import { get, push, ref, remove, set } from "firebase/database";
import { rtdb } from "@/firebaseConfig";
import { CytoscapeOptions } from "cytoscape";
import { edgesConverter } from "@/converters/edge";
import { nodesConverter } from "@/converters/node";
import { splitElements } from "./utils";
import { CreateTopologyParams, UpdateTopologyParams } from "@/types/Services";

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
  const indexSnap = await get(ref(rtdb, `topologyIndex/${id}`));
  if (!indexSnap.exists()) throw new Error(`Topology "${id}" not found`);


  const snap = await get(ref(rtdb, `topologies/${id}`));


  // the topology exists, but is empty (no nodes or edges)
  if (!snap.exists()) {
    return {
      id,
      elements: [],
    };
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


export const deleteTopologyById = async (id: string): Promise<void> => {
  try {
    await remove(ref(rtdb, `topologies/${id}`));

    await remove(ref(rtdb, `topologyIndex/${id}`));
  } catch (error) {
    throw new Error(`Error al eliminar la topología "${id}": ${error}`);
  }
};


export const createTopology = async (
  params: CreateTopologyParams
): Promise<Topology> => {
  const { name, elements } = params;

  // generate a new ID for the topology
  const indexRef = ref(rtdb, "topologyIndex");
  const newIndexRef = push(indexRef);
  const newId = newIndexRef.key;
  if (!newId) {
    throw new Error("No se pudo generar un ID para la nueva topología");
  }

  // save the name in topologyIndex/{newId}
  await set(newIndexRef, name);

  const { nodes, edges } = splitElements(elements);
  const topologyRef = ref(rtdb, `topologies/${newId}`);
  await set(topologyRef, { nodes, edges });

  // return the new topology structure
  return {
    id: newId,
    elements,
  };
};


export const updateTopologyById = async ({
  id,
  elements,
}: UpdateTopologyParams): Promise<Topology> => {
  const { nodes, edges } = splitElements(elements);

  // rewrite the topology in topologyIndex/{id}
  await set(ref(rtdb, `topologies/${id}`), { nodes, edges });

  // return the updated topology structure
  return { id, elements };
};