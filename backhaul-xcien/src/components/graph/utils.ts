import { CytoscapeOptions } from "cytoscape";

export const elements: CytoscapeOptions["elements"] = [
  {
    // node a
    data: { id: "a" },
  },
  {
    // node b
    data: { id: "b" },
  },
  {
    // edge ab
    data: { id: "ab", source: "a", target: "b", label: "100/200" },
  },
];

export const style: CytoscapeOptions["style"] = [
  {
    selector: "node",
    style: {
      "background-color": "#666",
      label: "data(id)",
    },
  },

  {
    selector: "edge",
    style: {
      width: 3,
      "line-color": "#ccc",
      "target-arrow-color": "#ccc",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
      label: "data(label)",
    },
  },
];

export const layout: CytoscapeOptions["layout"] = {
  name: "grid",
  rows: 1,
};
