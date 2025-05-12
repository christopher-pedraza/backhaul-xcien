import { useContext } from "react";
import { CytoscapeContext } from "@/context/CytoscapeContext";


export const useCyContext = () => {
  const ctx = useContext(CytoscapeContext);

  if (!ctx) {
    throw new Error("[useCyContext] Debes envolver la app en <CytoscapeProvider>")
  };

  return ctx;
};