import { createContext, Dispatch, SetStateAction } from "react";
import { Core } from "cytoscape";

interface CyContext {
  cy: Core | null;
  setCy: Dispatch<SetStateAction<Core | null>>;
};

export const CytoscapeContext = createContext<CyContext | null>(null);

