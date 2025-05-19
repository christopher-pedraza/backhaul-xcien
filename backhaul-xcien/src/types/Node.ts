export type NodeClass = "cloud" | "router" | "switch";

export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeData {
  id: string;
  name: string;
}

export interface Node {
  data: NodeData;
  position: NodePosition;
  classes: NodeClass;
}
