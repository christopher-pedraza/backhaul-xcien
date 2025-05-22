import { useState, useEffect } from "react";

// Components
import { Button, useDisclosure } from "@heroui/react";
import TabInput from "../TabInput";

// Contexts
import { useCyContext } from "@/hooks/useCyContext";

// Modals
import ConfirmationModal from "../ConfirmationModal";

interface EdgeTabProps {
  selectedNode: string;
  // TODO: Checar el tipo de node_data
  node_data: any;
}

export default function EdgeTab({ selectedNode, node_data }: EdgeTabProps) {
  const { cy } = useCyContext();
  if (!cy) return null;

  const [usage, setUsage] = useState("");
  const [capacity, setCapacity] = useState("");
  const [lastUsage, setLastUsage] = useState("");
  const [lastCapacity, setLastCapacity] = useState("");

  const errorsUsage: Array<string> = [];
  const errorsCapacity: Array<string> = [];

  const {
    isOpen: isOpenConfirmation,
    onOpen: onOpenConfirmation,
    onOpenChange: onOpenChangeConfirmation,
  } = useDisclosure();

  useEffect(() => {
    if (!node_data) {
      return;
    }
    setUsage(node_data["usage"] || "");
    setCapacity(node_data["capacity"] || "");
    setLastUsage(node_data["usage"] || "");
    setLastCapacity(node_data["capacity"] || "");
  }, [node_data]);

  const saveEdgeConfiguration = () => {
    if (errorsUsage.length === 0 && errorsCapacity.length === 0) {
      onOpenConfirmation();
    }
  };

  const confirmSaveConfiguration = () => {
    cy.getElementById(selectedNode).data({
      usage: usage,
      capacity: capacity,
      name: name,
    });
    setLastUsage(usage);
    setLastCapacity(capacity);
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

      <ConfirmationModal
        isOpen={isOpenConfirmation}
        onOpen={onOpenConfirmation}
        onOpenChange={onOpenChangeConfirmation}
        onConfirm={confirmSaveConfiguration}
        onCancel={() => {}}
      />
    </>
  );
}
