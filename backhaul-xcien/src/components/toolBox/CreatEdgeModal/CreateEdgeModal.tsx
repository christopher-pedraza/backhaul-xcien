import { FC } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";

interface CreateEdgeModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  sourceNode: string;
  setSourceNode: (value: string) => void;
  targetNode: string;
  setTargetNode: (value: string) => void;
  capacity: string;
  setCapacity: (value: string) => void;
  usage: string;
  setUsage: (value: string) => void;
  handleCreateLink: () => void;
  availableNodes: string[];
}

const CreateEdgeModal: FC<CreateEdgeModalProps> = ({
  isOpen,
  setIsOpen,
  sourceNode,
  setSourceNode,
  targetNode,
  setTargetNode,
  capacity,
  setCapacity,
  usage,
  setUsage,
  handleCreateLink,
  availableNodes,
}) => {
  const isFormValid =
    sourceNode.trim() !== "" &&
    targetNode.trim() !== "" &&
    sourceNode !== targetNode &&
    capacity.trim() !== "" &&
    usage.trim() !== "" &&
    !isNaN(Number(capacity)) &&
    !isNaN(Number(usage)) &&
    Number(capacity) > 0 &&
    Number(usage) >= 0;

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen} placement="center">
      <ModalContent>
        <ModalHeader>Crear enlace</ModalHeader>
        <ModalBody className="space-y-4">
          <Select
            isRequired
            label="Nodo origen"
            selectedKeys={[sourceNode]}
            onSelectionChange={(keys) => {
              const [value] = Array.from(keys);
              setSourceNode(value as string);
            }}
          >
            {availableNodes.map((node) => (
              <SelectItem key={node} value={node}>
                {node}
              </SelectItem>
            ))}
          </Select>

          <Select
            isRequired
            label="Nodo destino"
            selectedKeys={[targetNode]}
            onSelectionChange={(keys) => {
              const [value] = Array.from(keys);
              setTargetNode(value as string);
            }}
          >
            {availableNodes.map((node) => (
              <SelectItem key={node} value={node}>
                {node}
              </SelectItem>
            ))}
          </Select>

          <Input
            isRequired
            type="number"
            min={1}
            label="Capacidad"
            placeholder="Capacidad del enlace"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
          />

          <Input
            isRequired
            type="number"
            min={0}
            label="Uso"
            placeholder="Uso actual del enlace"
            value={usage}
            onChange={(e) => setUsage(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button color="default" variant="flat" onPress={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button color="primary" onPress={handleCreateLink} isDisabled={!isFormValid}>
            Crear enlace
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateEdgeModal;
