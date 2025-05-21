import { Client } from "@/types/Client";
import { clientsConverter, RtdbClients } from "./client";
import { Node, NodeClass } from "@/types/Node";

interface RtdbNodes {
  [nodeId: string]: {
    name: string;
    x: number;
    y: number;
    type: string;
    clients?: RtdbClients;
  };
}

/**
 * Converts the RTDB nodes structure into the application's node structure.
 *
 * This function transforms a structure received from the Real-Time Database (RTDB) into a format that
 * matches the expected Node array for our application.
 *
 * @param nodes - An object representing the nodes from the RTDB.
 * @returns An array of Node objects formatted for use in the application.
 */
export const nodesConverter = (nodes: RtdbNodes): Node[] => {
  return Object.entries(nodes).map(([nodeId, node]) => {
    const clients: Client[] = node.clients
      ? clientsConverter(node.clients)
      : [];

    return {
      data: {
        id: nodeId,
        name: node.name,
        clients: clients,
      },
      position: { x: node.x, y: node.y },
      classes: node.type as NodeClass,
    };
  });
};
