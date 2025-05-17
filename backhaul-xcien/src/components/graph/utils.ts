import { CytoscapeOptions } from "cytoscape";

export const elements: CytoscapeOptions["elements"] = [
  {
    // node a
    data: {
      id: "a",
      name: "Antena 1",
      usage: 100,
      capacity: 200,
      sold_capacity: 150,
    },
  },
  {
    // node b
    data: {
      id: "b",
      name: "Antena 2",
      usage: 50,
      capacity: 100,
      sold_capacity: 80,
    },
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
