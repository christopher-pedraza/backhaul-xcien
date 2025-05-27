import { useContext } from "react";
import ChangeCard from "../CardsChanges/ChangeCard";
import { ChangeLogContext } from "../../../src/context/ChangeLogContext";
import {
  getActionType,
  getActionTitle,
  getActionDetails,
} from "../CardsChanges/actions";
import EmptyChanges from "../EmptyChanges/EmptyChanges";
import { FileClock } from "lucide-react";
import { Button } from "@heroui/button";
import { generatePDFReport } from "@/utils/generateReport";
import { useAlerts } from "@/context/AlertContext";

const ChangesList = () => {
  const context = useContext(ChangeLogContext);
  const { alertCards } = useAlerts();

  if (!context) {
    return <div>Error: ChangeLogContext no está disponible</div>;
  }

  const { actions } = context;

  return (
    <div className="changes-list max-w-[370px] mx-auto my-0 relative h-[87vh] flex flex-col ">
      <div className="flex-1 max-h-full overflow-y-auto p-2 space-y-3 relative z-10">
        {actions.length === 0 ? (
          <EmptyChanges
            Icon={FileClock}
            message="No se han realizado cambios."
          />
        ) : (
          actions.map((action, index) => (
            <ChangeCard
              key={action.id}
              type={getActionType(action.type)}
              title={getActionTitle(action)}
              details={getActionDetails(action)}
              timestamp={action.timestamp}
              cardIndex={index + 1}
            />
          ))
        )}
      </div>

      <div className="pointer-events-none absolute bottom-12 left-0 w-full h-3 bg-gradient-to-t from-white to-transparent z-20" />

      <div className="flex justify-center items-center p-2 pt-5">
        <Button
          variant="ghost"
          color="primary"
          className="w-full"
          onPress={() => generatePDFReport(alertCards, actions)}
        >
          Exportar reporte
        </Button>
      </div>
    </div>
  );
};

export default ChangesList;
