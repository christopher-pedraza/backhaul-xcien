import { FC, useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import { useCyContext } from "@/hooks/useCyContext";
import { elements, layout, style } from "./utils";

export interface Props {}

const Graph: FC<Props> = ({}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { setCy } = useCyContext();

  // initializing cytoscape instance
  useEffect(() => {
    if (!containerRef.current) return;

    const instance = cytoscape({
      container: containerRef.current,
      elements,
      layout,
      style,
    });

    setCy(instance);
    return () => instance.destroy();
  }, []);

  return <div ref={containerRef} className="flex-1" />;
};

export default Graph;
