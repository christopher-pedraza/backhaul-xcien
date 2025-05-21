// Components
import {
  Button,
  ScrollShadow,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@heroui/react";

// Icons
import { PlusCircleIcon } from "lucide-react";
import PencilIcon from "../Icons/PencilIcon";

// Types
import { Client } from "@/types/Client";

interface NodeTabProps {
  clients: Array<Client>;
  onOpenChangeAddClient: () => void;
  onOpenChangeModifyClient: () => void;
  setSelectedClient: (client: Client | null) => void;
}

export default function NodeTab({
  clients,
  onOpenChangeAddClient,
  onOpenChangeModifyClient,
  setSelectedClient,
}: NodeTabProps) {
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
                    className="absolute right-0 top-0 bg-transparent"
                    isIconOnly
                    onPress={() => {
                      setSelectedClient(client);
                      onOpenChangeModifyClient();
                    }}
                    key={index + 100}
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
    </>
  );
}
