// AlertContext.tsx
import React, { createContext, useContext, useState } from "react";

type Alert = {
  edgeId: string;
  newUsage: number;
  capacity: number;
};

type AlertCardData = {
  enlace: string;
  porcentaje: number;
  uso: number;
  capacidadActual: string;
  capacidadRecomendada: string;
};

type AlertContextType = {
  alertCards: AlertCardData[];
  setAlertsFromResults: (alerts: Alert[]) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

const recommendedCapacities = [100, 200, 300, 500, 800, 1000, 1100, 1250, 1500];

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alertCards, setAlertCards] = useState<AlertCardData[]>([]);

  const setAlertsFromResults = (results: Alert[]) => {
    const generatedCards = results
      .map(({ edgeId, newUsage, capacity }) => {
        const porcentaje = Math.round((newUsage * 100) / capacity);

        const capacidadRecomendada =
          recommendedCapacities.find((c) => (newUsage * 100) / c <= 70) ||
          `${newUsage}`;

        return {
          enlace: edgeId,
          porcentaje,
          uso: newUsage,
          capacidadActual: `${capacity}MB`,
          capacidadRecomendada: `${capacidadRecomendada}MB`,
        };
      })
      .filter((alert) => alert.porcentaje > 70); // Solo alertas reales

    setAlertCards(generatedCards);
  };

  return (
    <AlertContext.Provider value={{ alertCards, setAlertsFromResults }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useAlerts must be used within an AlertProvider");
  }

  return context;
};
