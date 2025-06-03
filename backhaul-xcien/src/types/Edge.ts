import { BaseElement } from "./BaseElement";

export interface EdgeData {
  id: string;
  source: string;
  target: string;
  capacity?: number;
  usage?: number;
}

export interface Edge extends BaseElement {
  data: EdgeData;
}
