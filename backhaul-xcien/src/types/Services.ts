import { CytoscapeOptions } from "cytoscape";

export interface CreateTopologyParams {
  name: string;
  elements: CytoscapeOptions["elements"];
}

export interface UpdateTopologyParams {
  id: string;
  elements: CytoscapeOptions["elements"];
}
