import { useState, useEffect } from "react";

// Components
import { Button, useDisclosure } from "@heroui/react";
import TabInput from "../TabInput";

// Contexts
import { useCyContext } from "@/hooks/useCyContext";
import { useChangeLogContext } from "@/hooks/useChangeLogContext";
import { UserActionType } from "@/context/ChangeLogContext";

// Modals
import ConfirmationModal from "../ConfirmationModal";

interface EdgeTabProps {
  selectedNode: string;
  node_data: any;
}

export default function EdgeTab({ selectedNode, node_data }: EdgeTabProps) {
  const { cy } = useCyContext();
  if (!cy) return null;

  const { addAction } = useChangeLogContext();

  const [usage, setUsage] = useState("");
  const [capacity, setCapacity] = useState("");
  const [lastUsage, setLastUsage] = useState("");
  const [lastCapacity, setLastCapacity] = useState("");

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
    if (errorsCapacity.length === 0) {
      onOpenConfirmation();
    }
  };

  const confirmSaveConfiguration = () => {
    cy.getElementById(selectedNode).data({
      usage: usage,
      capacity: capacity,
    });
    setLastUsage(usage);
    setLastCapacity(capacity);
    // Agregar la acción al ChangeLog
    addAction({
      type: UserActionType.EDIT_EDGE,
      data: {
        oldName: node_data?.id || "",
        newName: node_data?.id || "",
        oldCapacity: lastCapacity.toString(),
        newCapacity: capacity.toString(),
        oldUsage: lastUsage.toString(),
        newUsage: usage.toString(),
      },
    });
  };

  if (node_data) {
    if (capacity === "") {
      errorsCapacity.push("El campo 'Capacidad' es obligatorio");
    } else if (isNaN(Number(capacity))) {
      errorsCapacity.push("El campo 'Capacidad' debe ser un número");
    } else if (Number(capacity) < 0) {
      errorsCapacity.push("El campo 'Capacidad' no puede ser negativo");
    }
  }

  var shouldDisableButton =
    errorsCapacity.length > 0 || capacity == lastCapacity;

  return (
    <>
      <TabInput
        label="Uso"
        value={usage}
        setValue={setUsage}
        isReadOnly={true}
        variant="bordered"
        labelPlacement="outside"
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
