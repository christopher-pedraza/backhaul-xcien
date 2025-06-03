import { Edge } from "@/types/Edge";
import { Node } from "@/types/Node";
import { CollectionReturnValue } from "cytoscape";

export const convertCyElementsToAppElements = (
  cyElements: CollectionReturnValue,
): (Node | Edge)[] => {
  return cyElements.map((element) => {
    const json = element.json() as any;

    return {
      data: json.data,
      position: element.isNode() ? json.position : undefined,
      classes: json.classes,
      type: element.isNode() ? "node" : "edge",
    } as Node | Edge;
  });
};
