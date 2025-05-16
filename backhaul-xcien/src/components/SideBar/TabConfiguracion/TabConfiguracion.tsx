import { Button, useDisclosure } from "@heroui/react";
import { useCyContext } from "@/hooks/useCyContext";
import { useState, useEffect } from "react";

// Components
import TabInput from "../TabInput/TabInput";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal";

interface TabConfiguracionProps {
  selectedNode: string;
  isOpen: boolean;
}

export default function TabConfiguracion({
  selectedNode,
  isOpen,
}: TabConfiguracionProps) {
  const { cy } = useCyContext();
  if (!cy) return null;

  const {
    isOpen: isOpenConfirmation,
    onOpen: onOpenConfirmation,
    onOpenChange: onOpenChangeConfirmation,
  } = useDisclosure();

  const [node_data, setNodeData] = useState(null);
  const [usage, setUsage] = useState("");
  const [capacity, setCapacity] = useState("");
  const [sold_capacity, setSoldCapacity] = useState("");
  const [name, setName] = useState("");

  const [lastUsage, setLastUsage] = useState("");
  const [lastCapacity, setLastCapacity] = useState("");
  const [lastSoldCapacity, setLastSoldCapacity] = useState("");

  const errorsUsage: Array<string> = [];
  const errorsCapacity: Array<string> = [];
  const errorsSoldCapacity: Array<string> = [];

  // Resetear los datos del nodo cuando se cierra el sidebar
  //   useEffect(() => {
  //     if (!isOpen) {
  //       setNodeData(null);
  //       setUsage(lastUsage);
  //       setCapacity(lastCapacity);
  //       setSoldCapacity(lastSoldCapacity);
  //     }
  //   }, [isOpen]);

  useEffect(() => {
    const node = cy.getElementById(selectedNode);
    if (node) {
      setNodeData(node.data());
    }
  }, [selectedNode, cy]);

  useEffect(() => {
    if (node_data) {
      setUsage(node_data["usage"] || "");
      setCapacity(node_data["capacity"] || "");
      setSoldCapacity(node_data["sold_capacity"] || "");
      setName(node_data["name"] || "");

      // Guardar los valores anteriores para comparar
      setLastUsage(node_data["usage"] || "");
      setLastCapacity(node_data["capacity"] || "");
      setLastSoldCapacity(node_data["sold_capacity"] || "");
    }
  }, [node_data]);

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

  if (sold_capacity === "") {
    errorsSoldCapacity.push("El campo 'Capacidad vendida' es obligatorio");
  } else if (isNaN(Number(sold_capacity))) {
    errorsSoldCapacity.push("El campo 'Capacidad vendida' debe ser un número");
  } else if (Number(sold_capacity) < 0) {
    errorsSoldCapacity.push(
      "El campo 'Capacidad vendida' no puede ser negativo"
    );
  }

  const saveConfiguration = () => {
    if (
      errorsUsage.length === 0 &&
      errorsCapacity.length === 0 &&
      errorsSoldCapacity.length === 0
    ) {
      onOpenConfirmation();
    }
  };

  const confirmSaveConfiguration = () => {
    cy.getElementById(selectedNode).data({
      usage: usage,
      capacity: capacity,
      sold_capacity: sold_capacity,
      name: name,
    });
    setLastUsage(usage);
    setLastCapacity(capacity);
    setLastSoldCapacity(sold_capacity);
  };

  const cancelSaveConfiguration = () => {
    // setUsage(lastUsage);
    // setCapacity(lastCapacity);
    // setSoldCapacity(lastSoldCapacity);
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">{name}</h1>

      <TabInput
        label="Uso"
        value={usage}
        setValue={setUsage}
        errors={errorsUsage}
        hasChanges={usage !== lastUsage}
      />
      <TabInput
        label="Capacidad"
        value={capacity}
        setValue={setCapacity}
        errors={errorsCapacity}
        hasChanges={capacity !== lastCapacity}
      />
      <TabInput
        label="Capacidad vendida"
        value={sold_capacity}
        setValue={setSoldCapacity}
        errors={errorsSoldCapacity}
        hasChanges={sold_capacity !== lastSoldCapacity}
      />

      <Button onPress={saveConfiguration}>Guardar</Button>

      <ConfirmationModal
        isOpen={isOpenConfirmation}
        onOpen={onOpenConfirmation}
        onOpenChange={onOpenChangeConfirmation}
        onConfirm={confirmSaveConfiguration}
        onCancel={cancelSaveConfiguration}
      />
    </>
  );
}
