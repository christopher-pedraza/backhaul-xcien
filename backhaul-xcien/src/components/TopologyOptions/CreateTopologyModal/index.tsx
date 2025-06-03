import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { convertCyElementsToAppElements } from "../utils";
import { CreateTopologyParams } from "@/types/Services";
import { FC, useEffect, useState } from "react";
import { useCyContext } from "@/hooks/useCyContext";
import useCreateTopology from "@/hooks/topologies/useCreateTopology";

interface Props {
  createEmptyTopology: boolean;
  isOpen: boolean;
  onCreatedTopology: (createdTopologyId: string) => void;
  onOpenChange: () => void;
}

const CreateTopologyModal: FC<Props> = ({
  createEmptyTopology,
  isOpen,
  onCreatedTopology,
  onOpenChange,
}) => {
  const { cy } = useCyContext();
  const { mutate: createTopology, isPending: isCreatingTopology } =
    useCreateTopology();

  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);

  const hasError = !name.trim();

  // reset states when the modal is closed
  useEffect(() => {
    if (!isOpen) resetStates();
  }, [isOpen]);

  const resetStates = () => {
    setName("");
    setTouched(false);
  };

  const handleConfirm = (close: () => void) => {
    if (!cy) return;

    setTouched(true);
    if (hasError) return;

    const elements = cy.elements();
    const convertedElements = convertCyElementsToAppElements(elements);

    const params: CreateTopologyParams = {
      name: name.trim(),
      elements: createEmptyTopology ? [] : convertedElements,
    };
    createTopology(params, {
      onSuccess: (data) => {
        onCreatedTopology(data.id);
        resetStates();
        console.log({ message: "Topología creada correctamente", data });
        close();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Crear Topología
            </ModalHeader>
            <ModalBody>
              <Input
                label="Nombre de la Topología"
                placeholder="Ingrese el nombre de la topología"
                variant="bordered"
                isRequired
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => setTouched(true)}
                isInvalid={touched && hasError}
                errorMessage={
                  touched && hasError
                    ? "El nombre de la topología es obligatorio."
                    : ""
                }
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="flat"
                onPress={() => {
                  onClose();
                }}
                disabled={isCreatingTopology}
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                isDisabled={isCreatingTopology || hasError}
                isLoading={isCreatingTopology}
                onPress={() => handleConfirm(onClose)}
              >
                Confirmar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CreateTopologyModal;
