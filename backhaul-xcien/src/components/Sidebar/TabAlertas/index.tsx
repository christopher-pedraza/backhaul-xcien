import React from "react";
import AlertCard from "../AlertCard";
import { useAlerts } from "@/context/AlertContext";

const TabAlertas: React.FC = () => {
  // Datos de las alertas
  const { alertCards } = useAlerts();

  return (
    <div className="flex items-center justify-center max-w-[370px] h-full">
      <div className="p-1 space-y-4 overflow-y-auto max-h-[85vh]">
        {alertCards.length === 0 ? (
          <p className="text-sm text-gray-500">No hay alertas por mostrar.</p>
        ) : (
          alertCards.map((alert) => (
            <AlertCard
              key={alert.enlace}
              enlace={alert.enlace}
              porcentaje={alert.porcentaje}
              uso={alert.uso}
              capacidadActual={alert.capacidadActual}
              capacidadRecomendada={alert.capacidadRecomendada}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TabAlertas;
