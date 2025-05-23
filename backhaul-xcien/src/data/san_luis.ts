import { CytoscapeOptions } from "cytoscape";
import { Edge } from "@/types/Edge";
import { Node } from "@/types/Node";

const nodes: Node[] = [
  {
    data: { id: "carrier", name: "Carrier Flo Networks\n700 Mb", clients: [] },
    position: { x: 0, y: 0 },
    classes: "cloud",
  },
  {
    data: { id: "coreSanLuis", name: "Core Border\nSan Luis", clients: [] },
    position: { x: 0, y: 100 },
    classes: "router",
  },
  {
    data: { id: "switchEME", name: "SW PoE\nEdificio EME", clients: [] },
    position: { x: 0, y: 200 },
    classes: "switch",
  },
  {
    data: { id: "switchMatias", name: "Switch\nLos Matias", clients: [] },
    position: { x: -200, y: 250 },
    classes: "switch",
  },
  {
    data: { id: "wrtMatias", name: "WRT Planta\nLos Matias", clients: [] },
    position: { x: -200, y: 450 },
    classes: "router",
  },
  {
    data: { id: "repCerro", name: "Rep\nCerro Gordo", clients: [] },
    position: { x: 0, y: 450 },
    classes: "switch",
  },
  {
    data: { id: "coreCarretera57", name: "Core Carretera 57", clients: [] },
    position: { x: 200, y: 200 },
    classes: "router",
  },
  {
    data: {
      id: "coreSanAntonioTRM2",
      name: "Core San Antonio\nTRM2",
      clients: [],
    },
    position: { x: 200, y: 450 },
    classes: "router",
  },
];

const edges: Edge[] = [
  {
    data: {
      id: "carrier_core",
      source: "carrier",
      target: "coreSanLuis",
      capacity: 10,
      usage: 0,
    },
  },
  {
    data: {
      id: "core_switchEME",
      source: "coreSanLuis",
      target: "switchEME",
      capacity: 10,
      usage: 0,
    },
  },
  {
    data: {
      id: "switchEME_coreCarretera57",
      source: "switchEME",
      target: "coreCarretera57",
      capacity: 700,
      usage: 0,
    },
  },
  {
    data: {
      capacity: 160,
      usage: 0,
      id: "RF_C5C_Edificio_EME-Los_Matias",
      source: "switchEME",
      target: "switchMatias",
    },
  },
  {
    data: {
      capacity: 180,
      usage: 0,
      id: "RF_B5C_Edificio_EME-Los_Matias",
      source: "switchEME",
      target: "switchMatias",
    },
  },
  {
    data: {
      capacity: 100,
      usage: 0,
      id: "RF_C5X_Principal",
      source: "switchMatias",
      target: "wrtMatias",
    },
  },
  {
    data: {
      capacity: 100,
      usage: 0,
      id: "RF_C5X_Backup",
      source: "switchMatias",
      target: "wrtMatias",
    },
  },
  {
    data: {
      capacity: 180,
      usage: 0,
      id: "RF_C5C_San_Antonio_TRM2-Cerro_Gordo",
      source: "coreSanAntonioTRM2",
      target: "repCerro",
    },
  },
  {
    data: {
      capacity: 1800,
      usage: 0,
      id: "RF_AF60_Carretera_57-San_Antonio_TRM2",
      source: "coreCarretera57",
      target: "coreSanAntonioTRM2",
    },
  },
  {
    data: {
      capacity: 390,
      usage: 0,
      id: "RF_C5C_Carretera_57_San_Antonio_TRM2",
      source: "coreCarretera57",
      target: "coreSanAntonioTRM2",
    },
  },
];

export const sanLuisNetwork: CytoscapeOptions["elements"] = [
  ...nodes,
  ...edges,
];
