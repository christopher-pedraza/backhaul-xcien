// ChangesList.tsx
import { useContext } from "react";
import ChangeCard from "../CardsChanges/ChangeCard";
import { ChangeLogContext } from "../../../src/context/ChangeLogContext";
import {
  getActionType,
  getActionTitle,
  getActionDetails,
} from "../CardsChanges/actions";

const ChangesList = () => {
  const context = useContext(ChangeLogContext);

  if (!context) {
    return <div>Error: ChangeLogContext no está disponible</div>;
  }

  const { actions } = context;

  return (
    <div className="changes-list max-w-2xl mx-auto my-6 relative h-[80vh]">
      <div className="max-h-full overflow-y-auto p-2 space-y-3 relative z-10">
        {actions.map((action, index) => (
          <ChangeCard
            key={action.id}
            type={getActionType(action.type)}
            title={getActionTitle(action)}
            details={getActionDetails(action)}
            timestamp={action.timestamp}
            cardIndex={index + 1}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent z-20" />
    </div>
  );
};

export default ChangesList;
