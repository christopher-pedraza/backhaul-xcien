import { Core } from "cytoscape";
import { FC, ReactNode, useState } from "react";
import { CytoscapeContext } from "@/context/CytoscapeContext";

export const CytoscapeProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cy, setCy] = useState<Core | null>(null);

  return (
    <CytoscapeContext.Provider value={{ cy, setCy }}>
      {children}
    </CytoscapeContext.Provider>
  );
};
