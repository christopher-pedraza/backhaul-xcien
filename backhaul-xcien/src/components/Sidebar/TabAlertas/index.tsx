import React from "react";
import AlertCard from "../AlertCard"; // Importamos el componente AlertCard

const TabAlertas: React.FC = () => {
  // Datos de las alertas
  const alertsData = [
    {
      title: "Enlace: Conexión Sur",
      usagePercentage: 85,
      recommendation: "Se recomienda aumentar capacidad de: 200MB → 500MB",
      isCritical: false,
    },
    {
      title: "Enlace: Conexión Paz",
      usagePercentage: 105,
      recommendation: "Se recomienda aumentar capacidad de: 300MB → 800MB",
      isCritical: true,
    },
  ];

  return (
    <div className="p-4">
      <AlertCard
        enlace="Conexión Sur"
        porcentaje={85}
        uso={85}
        capacidadActual="200MB"
        capacidadRecomendada="500MB"
      />
      <AlertCard
        enlace="Conexión Paz"
        porcentaje={105}
        uso={105}
        capacidadActual="300MB"
        capacidadRecomendada="800MB"
      />
    </div>
  );
};

export default TabAlertas;
