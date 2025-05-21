import { Edge } from "@/types/Edge";

interface RtdbEdges {
  [edgeId: string]: {
    source: string;
    target: string;
    capacity: number;
    usage: number;
  };
}

/**
 * Converts the RTDB edges structure into the application's edge structure.
 *
 * This function transforms a structure received from the Real-Time Database (RTDB) into a format that
 * matches the expected Edge array for our application.
 *
 * @param edges - An object representing the edges from the RTDB.
 * @returns An array of Edge objects formatted for use in the application.
 */
export const edgesConverter = (edges: RtdbEdges): Edge[] => {
  return Object.entries(edges).map(([edgeId, edge]: any) => ({
    data: {
      id: edgeId,
      source: edge.source,
      target: edge.target,
      capacity: edge.capacity,
      usage: edge.usage,
    },
  }));
};
