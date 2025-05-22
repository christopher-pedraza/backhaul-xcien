import { useState } from "react";
import { ChevronDown, ChevronRight, AlertTriangle, AlertOctagon } from "lucide-react";

export default function AlertCard({
  enlace,
  porcentaje,
  uso,
  capacidadActual,
  capacidadRecomendada,
}) {
  const isCritical = porcentaje > 100;
  const [expanded, setExpanded] = useState(true);

  const color = isCritical ? "red" : "yellow";
  const icon = isCritical ? <AlertOctagon className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />;
  const textColor = isCritical ? "text-red-600" : "text-yellow-600";
  const borderColor = isCritical ? "border-red-500" : "border-yellow-400";
  const bgColor = isCritical ? "bg-red-600" : "bg-yellow-400";

  return (
    <div
      className={`flex border ${borderColor} rounded-xl overflow-hidden shadow-sm`}
    >
      <div className={`flex flex-col items-center justify-center w-16 ${bgColor} text-white font-bold`}>
        <div className="flex flex-col items-center">
          {icon}
          <span>{porcentaje}%</span>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="flex justify-between items-center font-semibold">
          <span>Enlace: {enlace}</span>
          <button onClick={() => setExpanded(!expanded)}>
            {expanded ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>

        {expanded && (
          <div className="mt-2 text-sm">
            <div>
              Predicción de uso:{" "}
              <span className={`${textColor} font-semibold`}>{uso}%</span>
            </div>
            <div className="mt-1">
              Se recomienda aumentar capacidad de:
              <br />
              <span className="font-semibold">
                {capacidadActual} → {capacidadRecomendada}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
