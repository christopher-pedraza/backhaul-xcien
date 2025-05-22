import { Client } from "@/types/Client";

export interface RtdbClients {
  [clientId: string]: {
    name: string;
    soldCapacity: number;
    usage: number;
  };
}

/**
 * Converts the RTDB clients structure into an array of Client objects.
 *
 * This function transforms an object containing clients retrieved from the Real-Time Database (RTDB)
 * into an array of Client objects.
 *
 * @param clients - An object representing the clients from the RTDB, where each key is a client identifier.
 * @returns An array of Client objects formatted for use in the application.
 */
export const clientsConverter = (clients: RtdbClients): Client[] => {
  return Object.entries(clients).map(([clientId, c]: any) => ({
    id: clientId,
    name: c.name,
    soldCapacity: c.soldCapacity,
    usage: c.usage,
  }));
};
