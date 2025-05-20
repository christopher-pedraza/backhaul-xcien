import { Button, useDisclosure } from "@heroui/react";
import { useCyContext } from "@/hooks/useCyContext";
import { useState, useEffect } from "react";

// Components
import TabInput from "../TabInput";
import ConfirmationModal from "../ConfirmationModal";

// Types
import { NodeData } from "@/types/Node";
import PencilIcon from "../Icons/PencilIcon";
import ChangeNameModal from "../ChangeNameModal";

interface TabConfiguracionProps {
  selectedNode: string;
  selectedType: string;
}

function EdgeTab({
  usage,
  setUsage,
  lastUsage,
  capacity,
  setCapacity,
  lastCapacity,
  onOpenConfirmation,
}: {
  usage: string;
  setUsage: (v: string) => void;
  lastUsage: string;
  capacity: string;
  setCapacity: (v: string) => void;
  lastCapacity: string;
  onOpenConfirmation: () => void;
}) {
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

function NodeTab() {
  return <></>;
}

export default function TabConfiguracion({
  selectedNode,
  selectedType,
}: TabConfiguracionProps) {
  const { cy } = useCyContext();
  if (!cy) return null;

  const {
    isOpen: isOpenConfirmation,
    onOpen: onOpenConfirmation,
    onOpenChange: onOpenChangeConfirmation,
  } = useDisclosure();

  const {
    isOpen: isOpenName,
    onOpen: onOpenName,
    onOpenChange: onOpenChangeName,
  } = useDisclosure();

  const [node_data, setNodeData] = useState(null);
  const [usage, setUsage] = useState("");
  const [capacity, setCapacity] = useState("");
  const [name, setName] = useState("");

  const [lastUsage, setLastUsage] = useState("");
  const [lastCapacity, setLastCapacity] = useState("");

  useEffect(() => {
    const node = cy.getElementById(selectedNode);
    if (node) {
      setNodeData(node.data());
    }
  }, [selectedNode, cy]);

  useEffect(() => {
    if (!node_data) {
      return;
    }

    if (selectedType == "node") {
      setName(node_data["name"] || "");
    } else if (selectedType == "edge") {
      setName(node_data["id"]);
      setUsage(node_data["usage"] || "");
      setCapacity(node_data["capacity"] || "");
      setLastUsage(node_data["usage"] || "");
      setLastCapacity(node_data["capacity"] || "");
    }
  }, [node_data]);

  const confirmSaveConfiguration = () => {
    cy.getElementById(selectedNode).data({
      usage: usage,
      capacity: capacity,
      name: name,
    });
    setLastUsage(usage);
    setLastCapacity(capacity);
  };

  const confirmSaveName = (newName: string) => {
    cy.getElementById(selectedNode).data({
      name: newName,
    });
    setName(newName);
  };

  const cancelSaveConfiguration = () => {
    // setUsage(lastUsage);
    // setCapacity(lastCapacity);
  };

  return (
    <div className="flex flex-col items-center p-4 h-full">
      <Button
        endContent={<PencilIcon />}
        className="bg-transparent mb-4"
        onPress={onOpenChangeName}
      >
        <h1 className="text-2xl font-bold text-ellipsis whitespace-nowrap overflow-hidden max-w-[300px]">
          {name}
        </h1>
      </Button>

      {selectedType == "node" ? (
        <NodeTab />
      ) : selectedType == "edge" ? (
        <EdgeTab
          usage={usage}
          setUsage={setUsage}
          lastUsage={lastUsage}
          capacity={capacity}
          setCapacity={setCapacity}
          lastCapacity={lastCapacity}
          onOpenConfirmation={onOpenConfirmation}
        />
      ) : null}

      <ConfirmationModal
        isOpen={isOpenConfirmation}
        onOpen={onOpenConfirmation}
        onOpenChange={onOpenChangeConfirmation}
        onConfirm={confirmSaveConfiguration}
        onCancel={cancelSaveConfiguration}
      />
      <ChangeNameModal
        isOpen={isOpenName}
        onOpenChange={onOpenChangeName}
        onConfirm={confirmSaveName}
        name={name}
      />
    </div>
  );
}
