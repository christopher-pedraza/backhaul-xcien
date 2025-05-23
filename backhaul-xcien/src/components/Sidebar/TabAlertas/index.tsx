import React from "react";
import AlertCard from "../AlertCard";
import { useAlerts } from "@/context/AlertContext";

const TabAlertas: React.FC = () => {
  // Datos de las alertas
  const { alertCards } = useAlerts();

  return (
    <div className="p-4 space-y-4">
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
  );
};

export default TabAlertas;
