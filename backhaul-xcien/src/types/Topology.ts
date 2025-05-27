import { CytoscapeOptions } from "cytoscape";

export interface Topology {
  id: string;
  elements: CytoscapeOptions["elements"];
}
