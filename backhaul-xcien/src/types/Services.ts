import { CytoscapeOptions } from "cytoscape";

export interface CreateTopologyParams {
  name: string;
  elements: CytoscapeOptions["elements"];
}