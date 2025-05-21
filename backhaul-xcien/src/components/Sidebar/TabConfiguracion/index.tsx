import { Button, useDisclosure } from "@heroui/react";
import { useCyContext } from "@/hooks/useCyContext";
import { useState, useEffect } from "react";

// Tabs
import EdgeTab from "../EdgeTab";
import NodeTab from "../NodeTab";

// Modals
import ConfirmationModal from "../ConfirmationModal";
import ChangeNameModal from "../ChangeNameModal";
import AddClientModal from "../AddClientModal";
import ModifyClientModal from "../ModifyClientModal";

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
    isOpen: isOpenConfirmation,
    onOpen: onOpenConfirmation,
    onOpenChange: onOpenChangeConfirmation,
  } = useDisclosure();

  const {
    isOpen: isOpenName,
    // onOpen: onOpenName,
    onOpenChange: onOpenChangeName,
  } = useDisclosure();

  const {
    isOpen: isOpenAddClient,
    // onOpen: onOpenAddClient,
    onOpenChange: onOpenChangeAddClient,
  } = useDisclosure();

  const {
    isOpen: isOpenModifyClient,
    // onOpen: onOpenModifyClient,
    onOpenChange: onOpenChangeModifyClient,
  } = useDisclosure();

  const [node_data, setNodeData] = useState(null);
  const [usage, setUsage] = useState("");
  const [capacity, setCapacity] = useState("");
  const [name, setName] = useState("");
  const [clients, setClients] = useState<Array<Client>>([]);

  const [lastUsage, setLastUsage] = useState("");
  const [lastCapacity, setLastCapacity] = useState("");

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

  const confirmAddClient = (client: Client) => {
    const newClients = [...clients, client];
    setClients(newClients);
    cy.getElementById(selectedNode).data({
      clients: newClients,
    });
  };

  const confirmModifyClient = (client: Client) => {
    const newClients = clients.map((c) => {
      if (c.id === client.id) {
        return client;
      }
      return c;
    });
    setClients(newClients);
    cy.getElementById(selectedNode).data({
      clients: newClients,
    });
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
        <h1 className="text-xl font-bold text-ellipsis whitespace-nowrap overflow-hidden max-w-[300px]">
          {name}
        </h1>
      </Button>

      {selectedType == "node" ? (
        <NodeTab
          clients={clients}
          onOpenChangeAddClient={onOpenChangeAddClient}
          onOpenChangeModifyClient={onOpenChangeModifyClient}
          setSelectedClient={setSelectedClient}
        />
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

      <AddClientModal
        isOpen={isOpenAddClient}
        onOpenChange={onOpenChangeAddClient}
        onConfirm={confirmAddClient}
      />

      <ModifyClientModal
        isOpen={isOpenModifyClient}
        onOpenChange={onOpenChangeModifyClient}
        onConfirm={confirmModifyClient}
        selectedClient={selectedClient}
      />
    </div>
  );
}
