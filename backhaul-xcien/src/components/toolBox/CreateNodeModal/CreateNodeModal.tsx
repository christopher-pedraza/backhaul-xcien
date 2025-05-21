import { FC } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  Input,
} from "@heroui/react";

interface CreateNodeModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  newNodeId: string;
  setNewNodeId: (value: string) => void;
  handleCreateNode: () => void;
}

const CreateNodeModal: FC<CreateNodeModalProps> = ({
  isOpen,
  setIsOpen,
  newNodeId,
  setNewNodeId,
  handleCreateNode,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen} placement="center">
      <ModalContent>
        <ModalHeader>Crear nodo</ModalHeader>
        <ModalBody>
          <Input
            isRequired
            label="ID del Nodo"
            placeholder="Identificador del nodo"
            value={newNodeId}
            onChange={(e) => setNewNodeId(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="flat"
            onPress={() => setIsOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            color="primary"
            onPress={handleCreateNode}
            isDisabled={!newNodeId.trim()}
          >
            Crear
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateNodeModal;
