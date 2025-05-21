import { FC } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@heroui/react";

interface CreateNodeModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  newNodeId: string;
  setNewNodeId: (value: string) => void;
  handleCreateNode: () => void;
  nodeExists: boolean;
  error: string | null;
  setError: (error: string | null) => void;
}

const CreateNodeModal: FC<CreateNodeModalProps> = ({
  isOpen,
  setIsOpen,
  newNodeId,
  setNewNodeId,
  handleCreateNode,
  nodeExists,
  error,
  setError,
}) => {
  const isFormValid = newNodeId.trim() !== "" && !nodeExists;

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen} placement="center">
      <ModalContent>
        <ModalHeader>Crear Nodo</ModalHeader>

        <ModalBody className="space-y-4">
          {/* Campo para Nombre del Nodo */}
          <Input
            isRequired
            label="Nombre del Nodo"
            placeholder="Ej. Router Principal"
            value={newNodeId}
            onChange={(e) => {
              setNewNodeId(e.target.value);
              setError(null); // Limpiar error al editar
            }}
            isInvalid={nodeExists}
          />

          {/* Mensaje de error */}
          {nodeExists && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md">
              Ya existe un nodo con este nombre.
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button color="default" variant="flat" onPress={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button color="primary" onPress={handleCreateNode} isDisabled={!isFormValid}>
            Crear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateNodeModal;