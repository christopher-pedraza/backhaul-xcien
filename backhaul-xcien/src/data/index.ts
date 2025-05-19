import { Topology } from "@/types/Topology";
import { sanLuisNetwork } from "./san_luis";
import { piedrasNegrasNetwork } from "./piedras_negras";

export const TOPOLOGIES: Topology[] = [
  { id: "1", name: "Piedras Negras", elements: piedrasNegrasNetwork },
  { id: "2", name: "San Luis Potosí", elements: sanLuisNetwork },
];
