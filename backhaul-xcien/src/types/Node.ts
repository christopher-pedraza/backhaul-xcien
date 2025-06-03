import type { Client } from "./Client";
import { BaseElement } from "./BaseElement";

export type NodeClass = "cloud" | "router" | "switch";

export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeData {
  id: string;
  name: string;
  clients: Client[];
}

export interface Node extends BaseElement {
  data: NodeData;
  position: NodePosition;
  classes: NodeClass;
}
