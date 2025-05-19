import { Topology } from "@/types/Topology";
import { sanLuisNetwork } from "./san_luis";

export const TOPOLOGIES: Topology[] = [
  { id: "1", name: "San Luis Potosí", elements: sanLuisNetwork },
]