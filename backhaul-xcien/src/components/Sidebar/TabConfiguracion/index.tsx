import { Button, useDisclosure } from "@heroui/react";
import { useCyContext } from "@/hooks/useCyContext";
import { useState, useEffect } from "react";

// Tabs
import EdgeTab from "../EdgeConfigurationTab";
import NodeTab from "../NodeConfigurationTab";

// Modals
import ConfirmationModal from "../ConfirmationModal";
import ChangeNameModal from "../ChangeNameModal";

// Types
import { Client } from "@/types/Client";

// Icons
import PencilIcon from "../Icons/PencilIcon";

interface TabConfiguracionProps {
  selectedNode: string;
  selectedType: string;
}

export default function TabConfiguracion({
  selectedNode,
  selectedType,
}: TabConfiguracionProps) {
  const { cy } = useCyContext();
  if (!cy) return null;

  const {
    isOpen: isOpenName,
    // onOpen: onOpenName,
    onOpenChange: onOpenChangeName,
  } = useDisclosure();

  const [node_data, setNodeData] = useState(null);

  const [name, setName] = useState("");
  const [clients, setClients] = useState<Array<Client>>([]);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

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
      setClients(node_data["clients"] || []);
    } else if (selectedType == "edge") {
      setName(node_data["id"]);
    }
  }, [node_data]);

  const confirmSaveName = (newName: string) => {
    cy.getElementById(selectedNode).data({
      name: newName,
    });
    setName(newName);
  };

  return (
    <div className="flex flex-col items-center p-4 h-full">
      <Button
        endContent={<PencilIcon />}
        className="bg-transparent mb-4"
        onPress={onOpenChangeName}
      >
        <h1 className="text-xl font-bold text-ellipsis whitespace-nowrap overflow-hidden max-w-[300px]">
          {name}
        </h1>
      </Button>

      {selectedType == "node" ? (
        <NodeTab
          clients={clients}
          setClients={setClients}
          setSelectedClient={setSelectedClient}
          selectedClient={selectedClient}
          selectedNode={selectedNode}
        />
      ) : selectedType == "edge" ? (
        <EdgeTab selectedNode={selectedNode} />
      ) : null}

      <ChangeNameModal
        isOpen={isOpenName}
        onOpenChange={onOpenChangeName}
        onConfirm={confirmSaveName}
        name={name}
      />
    </div>
  );
}
