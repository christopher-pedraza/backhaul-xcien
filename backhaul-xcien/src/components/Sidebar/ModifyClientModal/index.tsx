import { Client } from "@/types/Client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { useState, useEffect } from "react";

interface ModifyClientModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (client: {
    id: string;
    name: string;
    soldCapacity: number;
    usage: number;
  }) => void;
  selectedClient?: Client | null;
}

export default function ModifyClientModal({
  isOpen,
  onOpenChange,
  onConfirm,
  selectedClient,
}: ModifyClientModalProps) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [soldCapacity, setSoldCapacity] = useState(0);
  const [usage, setUsage] = useState(0);

  useEffect(() => {
    setId(selectedClient?.id || "");
    setName(selectedClient?.name || "");
    setSoldCapacity(selectedClient?.soldCapacity || 0);
    setUsage(selectedClient?.usage || 0);
  }, [selectedClient]);

  const errors: Array<string> = [];

  if (name.length === 0) {
    errors.push("El nombre no puede estar vacío");
  } else if (name.length > 30) {
    errors.push("El nombre no puede tener más de 30 caracteres");
  } else if (name.length < 3) {
    errors.push("El nombre no puede tener menos de 3 caracteres");
  }
  if (isNaN(Number(soldCapacity)) || Number(soldCapacity) < 0) {
    errors.push("La capacidad vendida debe ser un número positivo");
  }
  if (isNaN(Number(usage)) || Number(usage) < 0) {
    errors.push("El uso debe ser un número positivo");
  }

  const confirm = () => {
    if (errors.length > 0) return;
    // Pasar un objeto cliente con los valores actuales
    onConfirm({
      id,
      name,
      soldCapacity: Number(soldCapacity),
      usage: Number(usage),
    });
    onOpenChange(false);
    setName("");
    setSoldCapacity(0);
    setUsage(0);
  };

  const cancel = () => {
    onOpenChange(false);
    setName("");
    setSoldCapacity(0);
    setUsage(0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{ wrapper: "z-[1000]", backdrop: "z-[999]" }}
    >
      <ModalContent>
        {(_) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Modificar cliente
            </ModalHeader>
            <ModalBody>
              <Input
                label="Nombre"
                value={name}
                onValueChange={setName}
                placeholder="Nombre del cliente"
                variant="underlined"
                size="lg"
                className="mb-2"
              />
              <Input
                label="Capacidad vendida"
                value={soldCapacity.toString()}
                onValueChange={(val) => setSoldCapacity(Number(val))}
                placeholder="Capacidad vendida"
                variant="underlined"
                size="lg"
                type="number"
                className="mb-2"
              />
              <Input
                label="Uso"
                value={usage.toString()}
                onValueChange={(val) => setUsage(Number(val))}
                placeholder="Uso actual"
                variant="underlined"
                size="lg"
                type="number"
              />
              {errors.length > 0 && (
                <ul className="text-danger text-sm mt-2">
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={cancel}>
                Cancelar
              </Button>
              <Button
                color="primary"
                onPress={confirm}
                isDisabled={errors.length > 0}
              >
                Guardar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
