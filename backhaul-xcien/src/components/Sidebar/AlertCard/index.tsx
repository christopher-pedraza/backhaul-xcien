import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  AlertOctagon,
} from "lucide-react";

// contexts
import { useCyContext } from "@/hooks/useCyContext";

type AlertCardProps = {
  enlace: string;
  porcentaje: number;
  uso: string;
  capacidadActual: string;
  capacidadRecomendada: string;
  setSelectedNode: (value: string) => void;
  setSelectedType: (value: string) => void;
};

export default function AlertCard({
  enlace,
  porcentaje,
  uso,
  capacidadActual,
  capacidadRecomendada,
  setSelectedNode,
  setSelectedType,
}: AlertCardProps) {
  const { cy } = useCyContext();

  const isCritical = porcentaje > 99;
  const [expanded, setExpanded] = useState(false);

  const color = isCritical ? "red" : "yellow";
  const icon = isCritical ? (
    <AlertOctagon className="w-5 h-5" />
  ) : (
    <AlertTriangle className="w-5 h-5" />
  );
  const textColor = isCritical ? "text-red-600" : "text-yellow-600";
  const borderColor = isCritical ? "border-red-500" : "border-yellow-400";
  const bgColor = isCritical ? "bg-red-600" : "bg-yellow-400";

  const handleSelectEdge = () => {
    const edge = cy?.getElementById(enlace);
    if (!edge) return;
    edge.select();
    setSelectedNode(enlace);
    setSelectedType("edge");
    cy?.animate(
      {
        center: { eles: edge },
      },
      { duration: 800 }
    );
    const originalColor = edge.style("line-color");
    const flashColor = isCritical ? "#ef4444" : "#facc15";
    // First flash
    edge.animate({ style: { "line-color": flashColor } }, { duration: 500 });
    setTimeout(() => {
      edge.animate(
        { style: { "line-color": originalColor } },
        { duration: 500 }
      );
      // Second flash
      setTimeout(() => {
        edge.animate(
          { style: { "line-color": flashColor } },
          { duration: 500 }
        );
        setTimeout(() => {
          edge.animate(
            { style: { "line-color": originalColor } },
            { duration: 500 }
          );
        }, 1000);
      }, 1000);
    }, 1000);
  };

  return (
    <div
      className={`flex border ${borderColor} rounded-xl overflow-hidden shadow-sm`}
    >
      <div
        className={`flex flex-col items-center justify-center w-16 ${bgColor} text-white font-bold`}
      >
        <div className="flex flex-col items-center">
          {icon}
          <span>{porcentaje}%</span>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="flex justify-between items-center font-semibold">
          <span onClick={handleSelectEdge}>Enlace: {enlace}</span>
          <button onClick={() => setExpanded(!expanded)}>
            {expanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            expanded ? "max-h-40" : "max-h-0"
          }`}
        >
          <div className="mt-2 text-sm">
            <div>
              Predicción de uso:{" "}
              <span className={`${textColor} font-semibold`}>
                {porcentaje}%
              </span>
            </div>
            <div className="mt-1">
              Se recomienda aumentar capacidad de:
              <br />
              <span className="font-semibold">
                {capacidadActual} → {capacidadRecomendada}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
