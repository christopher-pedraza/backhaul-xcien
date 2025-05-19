import { Topology } from "@/types/Topology";
import { TOPOLOGIES } from "@/data";

type TopologyOption = Pick<Topology, "id" | "name">;

export const getTopologyOptions = (): Promise<TopologyOption[]> => {
  return new Promise(res =>
    setTimeout(() =>
      res(TOPOLOGIES.map(({ id, name }) => ({ id, name }))),
      300) // Simulate a network request
  );
};

export const getTopologyById = (id: string): Promise<Topology> => {
  return new Promise(res =>
    setTimeout(() => {
      const topology = TOPOLOGIES.find(t => t.id === id);
      if (topology) {
        res(topology);
      } else {
        throw new Error("Topology not found");
      }
    }, 300) // Simulate a network request
  );
}