import { Button } from "@heroui/react";
import TabInput from "../TabInput";

interface EdgeTabProps {
  usage: string;
  setUsage: (v: string) => void;
  lastUsage: string;
  capacity: string;
  setCapacity: (v: string) => void;
  lastCapacity: string;
  onOpenConfirmation: () => void;
}

export default function EdgeTab({
  usage,
  setUsage,
  lastUsage,
  capacity,
  setCapacity,
  lastCapacity,
  onOpenConfirmation,
}: EdgeTabProps) {
  const errorsUsage: Array<string> = [];
  const errorsCapacity: Array<string> = [];

  const saveEdgeConfiguration = () => {
    if (errorsUsage.length === 0 && errorsCapacity.length === 0) {
      onOpenConfirmation();
    }
  };

  if (usage === "") {
    errorsUsage.push("El campo 'Uso' es obligatorio");
  } else if (isNaN(Number(usage))) {
    errorsUsage.push("El campo 'Uso' debe ser un número");
  } else if (Number(usage) < 0) {
    errorsUsage.push("El campo 'Uso' no puede ser negativo");
  } else if (Number(usage) > Number(capacity)) {
    errorsUsage.push("El campo 'Uso' no puede ser mayor que la capacidad");
  }

  if (capacity === "") {
    errorsCapacity.push("El campo 'Capacidad' es obligatorio");
  } else if (isNaN(Number(capacity))) {
    errorsCapacity.push("El campo 'Capacidad' debe ser un número");
  } else if (Number(capacity) < 0) {
    errorsCapacity.push("El campo 'Capacidad' no puede ser negativo");
  }

  var shouldDisableButton =
    errorsUsage.length > 0 ||
    errorsCapacity.length > 0 ||
    (usage == lastUsage && capacity == lastCapacity);

  return (
    <>
      <TabInput
        label="Uso"
        value={usage}
        setValue={setUsage}
        errors={errorsUsage}
        hasChanges={usage != lastUsage}
        isReadOnly={true}
      />
      <TabInput
        label="Capacidad"
        value={capacity}
        setValue={setCapacity}
        errors={errorsCapacity}
        hasChanges={capacity != lastCapacity}
      />
      <Button
        onPress={saveEdgeConfiguration}
        className="w-3/4"
        variant={shouldDisableButton ? "faded" : "ghost"}
        color={shouldDisableButton ? "default" : "primary"}
        isDisabled={shouldDisableButton}
      >
        Guardar
      </Button>
    </>
  );
}
