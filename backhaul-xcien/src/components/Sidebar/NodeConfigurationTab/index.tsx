import { useState, useEffect, act } from "react";

// Components
import {
  Button,
  ScrollShadow,
  Card,
  CardBody,
  CardHeader,
  Divider,
  useDisclosure,
} from "@heroui/react";

// Icons
import { PlusCircleIcon } from "lucide-react";
import PencilIcon from "../Icons/PencilIcon";
import { Trash2Icon } from "lucide-react";

// Types
import { Client } from "@/types/Client";

// Modals
import RemoveClientModal from "../RemoveClientModal";
import ModifyClientModal from "../ModifyClientModal";
import AddClientModal from "../AddClientModal";

// Contexts
import { useCyContext } from "@/hooks/useCyContext";
import { useChangeLogContext } from "@/hooks/useChangeLogContext";
import { UserActionType } from "@/context/ChangeLogContext";

interface NodeTabProps {
  selectedNode: string;
  node_data: any;
}

export default function NodeTab({ selectedNode, node_data }: NodeTabProps) {
  const { cy } = useCyContext();
  if (!cy) return;

  const { addAction, actions } = useChangeLogContext();

  const [clients, setClients] = useState<Array<Client>>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    if (!node_data) {
      return;
    }
    setClients(node_data["clients"] || []);
  }, [node_data]);

  useEffect(() => {
    console.log("actions", actions);
  }, [actions]);

  //
  // useDisclosure de los modales
  //
  const {
    isOpen: isOpenRemoveClient,
    onOpen: onOpenRemoveClient,
    onOpenChange: onOpenChangeRemoveClient,
  } = useDisclosure();
  const {
    isOpen: isOpenModifyClient,
    // onOpen: onOpenModifyClient,
    onOpenChange: onOpenChangeModifyClient,
  } = useDisclosure();
  const {
    isOpen: isOpenAddClient,
    // onOpen: onOpenAddClient,
    onOpenChange: onOpenChangeAddClient,
  } = useDisclosure();

  //
  // Funciones onSuccess para los modales
  //
  const handleDeleteClient = (client: Client) => {
    const updatedClients = clients.filter((c) => c.id !== client.id);
    cy.getElementById(selectedNode).data({
      clients: updatedClients,
    });
    setClients(updatedClients);
    // Agregar la acción al ChangeLog
    addAction({
      type: UserActionType.REMOVE_CLIENT,
      data: {
        name: client.name,
      },
    });
  };

  const confirmModifyClient = (client: Client) => {
    const oldClient = clients.find((c) => c.id === client.id);
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
    // Agregar la acción al ChangeLog
    addAction({
      type: UserActionType.EDIT_CLIENT,
      data: {
        oldName: oldClient?.name,
        newName: client.name,
        oldSoldCapacity: oldClient?.soldCapacity,
        newSoldCapacity: client.soldCapacity,
        oldUsage: oldClient?.usage,
        newUsage: client.usage,
      },
    });
  };

  const confirmAddClient = (client: Client) => {
    const newClients = [...clients, client];
    setClients(newClients);
    cy.getElementById(selectedNode).data({
      clients: newClients,
    });
    // Agregar la acción al ChangeLog
    addAction({
      type: UserActionType.ADD_CLIENT,
      data: {
        name: client.name,
        nodeName: node_data.name,
        soldCapacity: client.soldCapacity,
        usage: client.usage,
      },
    });
  };

  //
  // Funciones para abrir los modales
  //
  const onPressRemoveClient = (client: Client) => {
    setSelectedClient(client);
    onOpenChangeRemoveClient();
  };

  const onPressModifyClient = (client: Client) => {
    setSelectedClient(client);
    onOpenChangeModifyClient();
  };

  return (
    <>
      <Card className="w-full h-[400px]">
        <CardHeader className="relative text-xl font-bold flex flex-col items-center justify-center">
          <p>Clientes</p>
          <Button
            className="absolute right-2 top-1/8 bg-transparent"
            isIconOnly
            onPress={onOpenChangeAddClient}
          >
            <PlusCircleIcon />
          </Button>
        </CardHeader>
        <Divider />
        <CardBody>
          {clients.length > 0 ? (
            <ScrollShadow className="overflow-y-auto">
              {clients.map((client, index) => (
                <Card className="h-min-[100px] m-4 p-3 relative" key={index}>
                  <p className="text-lg font-bold">{client.name}</p>
                  <p className="text-medium">
                    <strong>Capacidad vendida: </strong>
                    {client.soldCapacity}
                  </p>
                  <p className="text-medium">
                    <strong> Uso: </strong>
                    {client.usage}
                  </p>
                  <Button
                    className="absolute right-0 top-1 bg-transparent"
                    isIconOnly
                    onPress={() => {
                      onPressRemoveClient(client);
                    }}
                    key={index + 100}
                  >
                    <Trash2Icon color="#bd5348" />
                  </Button>
                  <Button
                    className="absolute right-0 top-10 bg-transparent"
                    isIconOnly
                    onPress={() => {
                      onPressModifyClient(client);
                    }}
                    key={index + 200}
                  >
                    <PencilIcon />
                  </Button>
                </Card>
              ))}
            </ScrollShadow>
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center">
              <p className="text-lg">El nodo no cuenta con clientes.</p>
            </div>
          )}
        </CardBody>
      </Card>

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

      <RemoveClientModal
        isOpen={isOpenRemoveClient}
        onOpenChange={onOpenChangeRemoveClient}
        onOpen={onOpenRemoveClient}
        onConfirm={() => {
          if (selectedClient) {
            handleDeleteClient(selectedClient);
          }
          onOpenChangeRemoveClient();
        }}
        onCancel={() => {}}
      />
    </>
  );
}
