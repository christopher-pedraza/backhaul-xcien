import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Divider,
} from "@heroui/react";
import { useState, useEffect } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: (arg0: string) => void;
  name: string;
}

export default function ChangeNameModal({
  isOpen,
  onOpenChange,
  onConfirm,
  name,
}: ConfirmationModalProps) {
  const [newName, setNewName] = useState(name);

  useEffect(() => {
    setNewName(name);
  }, [name]);

  const errors: Array<string> = [];

  const confirm = () => {
    if (errors.length > 0) {
      return;
    }
    onConfirm(newName);
    onOpenChange(false);
  };

  const cancel = () => {
    onOpenChange(false);
  };

  if (newName.length === 0) {
    errors.push("El nombre no puede estar vacío");
  } else if (newName.length > 30) {
    errors.push("El nombre no puede tener más de 30 caracteres");
  } else if (newName.length < 3) {
    errors.push("El nombre no puede tener menos de 3 caracteres");
  }
  // else if (/[^a-zA-Z0-9]/.test(newName)) {
  //   errors.push("El nombre no puede contener caracteres especiales");
  // }

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
              Cambiar nombre
            </ModalHeader>
            <ModalBody>
              <Input
                label="Nuevo nombre"
                value={newName}
                onValueChange={setNewName}
                placeholder={name}
                variant="underlined"
                size="lg"
                errorMessage={() => (
                  <ul>
                    {errors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                )}
                isInvalid={errors.length > 0}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={cancel}>
                Cancelar
              </Button>
              <Button color="primary" onPress={confirm}>
                Guardar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
