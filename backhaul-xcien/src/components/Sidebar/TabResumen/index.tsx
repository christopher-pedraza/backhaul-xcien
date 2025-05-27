import ChangesList from "@/components/CardsChanges/ChangesList";
import "./TabResumen.css";
import { Button } from "@heroui/button";
import { generatePDFReport } from "@/utils/generateReport";
import { useAlerts } from "@/context/AlertContext";
import { useChangeLogContext } from "@/hooks/useChangeLogContext";

export default function TabResumen() {

    const { alertCards } = useAlerts();
    const { actions } = useChangeLogContext();

  return (
    <div>
      <ChangesList />
      <div className="flex justify-center items-center">
        <Button
          variant="ghost"
          color="primary"
          className="w-[95%]"
          onPress={() => generatePDFReport(alertCards, actions)}
        >
          Exportar reporte
        </Button>
      </div>
    </div>
  );
}
