import AlertCard from "../AlertCard";
import { useAlerts } from "@/context/AlertContext";
import EmptyChanges from "@/components/EmptyChanges/EmptyChanges";
import { generatePDFReport } from "@/utils/generateReport";
import { useChangeLogContext } from "@/hooks/useChangeLogContext";

import { Button } from "@heroui/button";

interface TabAlertasProps {
  setSelectedNode: (value: string) => void;
  setSelectedType: (value: string) => void;
}

export default function TabAlertas({
  setSelectedNode,
  setSelectedType,
}: TabAlertasProps) {
  const { alertCards } = useAlerts();
  const { actions } = useChangeLogContext();

  return (
    <div className="justify-between">
      <div className="max-w-[370px] mx-auto my-0 relative h-[81vh] flex flex-col">
        <div className="h-[75vh] overflow-y-auto p-2 space-y-3 relative z-10 flex-1">
          {alertCards.length === 0 ? (
            <EmptyChanges message="No hay alertas por mostrar." />
          ) : (
            alertCards.map((alert) => (
              <AlertCard
                key={alert.enlace}
                enlace={alert.enlace}
                porcentaje={alert.porcentaje}
                uso={alert.uso}
                capacidadActual={alert.capacidadActual}
                capacidadRecomendada={alert.capacidadRecomendada}
                setSelectedNode={setSelectedNode}
                setSelectedType={setSelectedType}
              />
            ))
          )}
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-3 bg-gradient-to-t from-white to-transparent z-20" />
      </div>
      <div className="flex justify-center items-center p-2">
        <Button
          variant="ghost"
          color="primary"
          className="w-full"
          onPress={() => {
            generatePDFReport(alertCards, actions);
          }}
        >
          Exportar reporte
        </Button>
      </div>
    </div>
  );
}
