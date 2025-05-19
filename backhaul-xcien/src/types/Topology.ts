import { CytoscapeOptions } from "cytoscape";

export interface Topology {
  id: string;
  name: string;
  elements: CytoscapeOptions["elements"];
}
