import { CytoscapeOptions } from "cytoscape";

const textColor = "#000000";

export const elements: CytoscapeOptions["elements"] = [];

export const style: CytoscapeOptions["style"] = [
  /* nodos genéricos */
  {
    selector: "node",
    style: {
      width: 48,
      height: 48,
      label: "data(name)",
      "text-wrap": "wrap",
      "text-max-width": "100px",
      "text-valign": "center",
      "text-halign": "center",
      color: textColor,
      "font-size": 8,
    },
  },

  /* aristas */
  {
    selector: "edge",
    style: {
      width: 1.5,
      "line-color": "#999",
      "target-arrow-shape": "none",
      "source-arrow-shape": "none",
      "curve-style": "bezier",
      label: (element: any) => {
        const usage = element.data("usage");
        const capacity = element.data("capacity");

        if (usage === undefined || capacity === undefined) {
          return "";
        }

        return `${usage} / ${capacity}`;
      },
      "font-size": 7,
      "text-background-opacity": 1,
      "text-background-color": "#fff",
      "text-background-padding": "2px",
    },
  },

  /* classes for icons */
  {
    selector: ".cloud",
    style: {
      "background-image": "/icons/cloud.svg",
      "background-fit": "contain",
      "background-opacity": 0,
    },
  },
  {
    selector: ".router",
    style: {
      "background-image": "/icons/router.svg",
      "background-fit": "contain",
      "background-opacity": 0,
    },
  },
  {
    selector: ".switch",
    style: {
      "background-image": "/icons/switch.svg",
      "background-fit": "contain",
      "background-opacity": 0,
    },
  },
];

export const layout: CytoscapeOptions["layout"] = {
  name: "preset",
};
