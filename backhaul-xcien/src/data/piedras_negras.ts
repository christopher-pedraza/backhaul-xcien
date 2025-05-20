import { CytoscapeOptions } from "cytoscape";
import { Edge } from "@/types/Edge";
import { Node } from "@/types/Node";

const nodes: Node[] = [
  // Carriers
  {
    data: {
      id: "movistar",
      name: "Carrier\nMovistar",
      clients: [],
    },
    position: { x: -100, y: 0 },
    classes: "cloud",
  },
  {
    data: {
      id: "fibranet500",
      name: "Capacidad 500 Mb\nCarrier\nFibranet",
      clients: [],
    },
    position: { x: -400, y: 0 },
    classes: "cloud",
  },
  {
    data: {
      id: "fibranet1000",
      name: "Capacidad 1000 Mb\nCarrier\nFibranet",
      clients: [],
    },
    position: { x: 100, y: 0 },
    classes: "cloud",
  },

  // Core routers
  {
    data: {
      id: "coreBorderPDN",
      name: "Core Border\nPiedras Negras",
      clients: [],
    },
    position: { x: 0, y: 100 },
    classes: "router",
  },
  {
    data: { id: "coreMorelos", name: "Core Morelos", clients: [] },
    position: { x: 200, y: 350 },
    classes: "router",
  },
  {
    data: { id: "coreVillaUnion", name: "Core Villa Unión", clients: [] },
    position: { x: 300, y: 350 },
    classes: "router",
  },
  {
    data: { id: "coreTelco", name: "Core Telco", clients: [] },
    position: { x: 250, y: 100 },
    classes: "router",
  },
  {
    data: { id: "coreApolo", name: "Core Apolo", clients: [] },
    position: { x: -200, y: 250 },
    classes: "router",
  },
  {
    data: { id: "coreAcuna", name: "Core Acuña", clients: [] },
    position: { x: -400, y: 150 },
    classes: "router",
  },
  {
    data: { id: "coreSispa", name: "Core Sispa", clients: [] },
    position: { x: 0, y: 400 },
    classes: "router",
  },
  {
    data: { id: "coreMTPGuerrero", name: "Core MTP\nGuerrero", clients: [] },
    position: { x: 300, y: 450 },
    classes: "router",
  },

  // Switches
  {
    data: { id: "swPoEPDN", name: "SW PoE\nPDN", clients: [] },
    position: { x: 0, y: 200 },
    classes: "switch",
  },
  {
    data: { id: "swRB2011Sispa", name: "SW RB2011\nSispa", clients: [] },
    position: { x: 70, y: 350 },
    classes: "switch",
  },
  {
    data: { id: "swPoESanCarlos", name: "SW PoE\nSan Carlos", clients: [] },
    position: { x: -200, y: 400 },
    classes: "switch",
  },
  {
    data: { id: "swPoEAcuna", name: "SW PoE\nAcuña", clients: [] },
    position: { x: -400, y: 250 },
    classes: "switch",
  },
];

const edges: Edge[] = [
  {
    data: {
      id: "carrier1000_coreBorderPDN",
      source: "fibranet1000",
      target: "coreBorderPDN",
    },
  },
  {
    data: {
      id: "movistar-coreBorderPDN",
      source: "movistar",
      target: "coreBorderPDN",
    },
  },
  {
    data: {
      id: "fibranet500-coreAcuna",
      source: "fibranet500",
      target: "coreAcuna",
    },
  },
  {
    data: {
      id: "coreBorderPDN-swPoEPDN",
      source: "coreBorderPDN",
      target: "swPoEPDN",
    },
  },
  {
    data: {
      id: "SwPDN-SwSispa",
      source: "swPoEPDN",
      target: "swRB2011Sispa",
      capacity: 390,
      usage: 0,
    },
  },
  {
    data: {
      id: "SwSispa-Morelos",
      source: "swRB2011Sispa",
      target: "coreMorelos",
      capacity: 180,
      usage: 0,
    },
  },
  {
    data: {
      id: "CoreMorelos-VillaUnion",
      source: "coreMorelos",
      target: "coreVillaUnion",
      capacity: 50,
      usage: 0,
    },
  },
  {
    data: {
      id: "CoreVillaUnion-CoreGuerrero",
      source: "coreVillaUnion",
      target: "coreMTPGuerrero",
      capacity: 100,
      usage: 0,
    },
  },
  {
    data: {
      id: "swAcuna-CoreApolo",
      source: "swPoEAcuna",
      target: "coreApolo",
      capacity: 720,
      usage: 0,
    },
  },
  {
    data: {
      id: "RF_B5C_Acuña-Apolo",
      source: "coreAcuna",
      target: "swPoEAcuna",
    },
  },
  {
    data: {
      id: "RF_C5C_Piedras_Negras-Telco",
      source: "coreBorderPDN",
      target: "coreTelco",
      capacity: 100,
      usage: 0,
    },
  },
  {
    data: {
      id: "CoreSispa-SwSispa",
      source: "coreSispa",
      target: "swRB2011Sispa",
    },
  },
  {
    data: {
      id: "CoreSispa-SwPDN",
      source: "coreSispa",
      target: "swPoEPDN",
      capacity: 480,
      usage: 0,
    },
  },
  {
    data: {
      id: "SwSanCarlos-CoreApolo",
      source: "swPoESanCarlos",
      target: "coreApolo",
      capacity: 100,
      usage: 0,
    },
  },
  {
    data: {
      id: "SwSanCarlos-CoreSispa",
      source: "swPoESanCarlos",
      target: "coreSispa",
      capacity: 150,
      usage: 0,
    },
  },
];

export const piedrasNegrasNetwork: CytoscapeOptions["elements"] = [
  ...nodes,
  ...edges,
];
