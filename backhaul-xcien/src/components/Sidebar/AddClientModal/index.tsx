import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";
import { useState } from "react";

interface AddClientModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (client: {
    id: string;
    name: string;
    soldCapacity: number;
    usage: number;
  }) => void;
}

export default function AddClientModal({
  isOpen,
  onOpenChange,
  onConfirm,
}: AddClientModalProps) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [soldCapacity, setSoldCapacity] = useState("");
  const [usage, setUsage] = useState("");

  const errors: Array<string> = [];

  if (id.length === 0) {
    errors.push("El ID no puede estar vacío");
  }
  if (name.length === 0) {
    errors.push("El nombre no puede estar vacío");
  } else if (name.length > 30) {
    errors.push("El nombre no puede tener más de 30 caracteres");
  } else if (name.length < 3) {
    errors.push("El nombre no puede tener menos de 3 caracteres");
  }
  if (
    soldCapacity === "" ||
    isNaN(Number(soldCapacity)) ||
    Number(soldCapacity) < 0
  ) {
    errors.push("La capacidad vendida debe ser un número positivo");
  }
  if (usage === "" || isNaN(Number(usage)) || Number(usage) < 0) {
    errors.push("El uso debe ser un número positivo");
  }

  const confirm = () => {
    if (errors.length > 0) return;
    onConfirm({
      id,
      name,
      soldCapacity: Number(soldCapacity),
      usage: Number(usage),
    });
    onOpenChange(false);
    setId("");
    setName("");
    setSoldCapacity("");
    setUsage("");
  };

  const cancel = () => {
    onOpenChange(false);
    setId("");
    setName("");
    setSoldCapacity("");
    setUsage("");
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
              Agregar cliente
            </ModalHeader>
            <ModalBody>
              <Input
                label="ID"
                value={id}
                onValueChange={setId}
                placeholder="ID único"
                variant="underlined"
                size="lg"
                className="mb-2"
              />
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
                value={soldCapacity}
                onValueChange={setSoldCapacity}
                placeholder="Capacidad vendida"
                variant="underlined"
                size="lg"
                type="number"
                className="mb-2"
              />
              <Input
                label="Uso"
                value={usage}
                onValueChange={setUsage}
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
                Agregar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
