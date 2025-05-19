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