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

// Tipo para opciones del dropdown
interface NodeOption {
  id: string;
  name: string;
}

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
  availableNodes: NodeOption[];
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

  // Ordena los nodos por nombre alfabéticamente
  const sortedAvailableNodes = [...availableNodes].sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
  );

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen} placement="center">
      <ModalContent>
        <ModalHeader>Crear enlace</ModalHeader>
        <ModalBody className="space-y-4">
          {/* Nodo Origen */}
          <Select
            isRequired
            label="Nodo origen"
            selectedKeys={[sourceNode]}
            onSelectionChange={(keys) => {
              const [value] = Array.from(keys);
              setSourceNode(value as string);
            }}
          >
            {sortedAvailableNodes.map((node) => (
              <SelectItem key={node.id} value={node.id}>
                {node.name}
              </SelectItem>
            ))}
          </Select>

          {/* Nodo Destino */}
          <Select
            isRequired
            label="Nodo destino"
            selectedKeys={[targetNode]}
            onSelectionChange={(keys) => {
              const [value] = Array.from(keys);
              setTargetNode(value as string);
            }}
          >
            {sortedAvailableNodes.map((node) => (
              <SelectItem key={node.id} value={node.id}>
                {node.name}
              </SelectItem>
            ))}
          </Select>

          {/* Uso */}
          <Input
            isRequired
            type="number"
            min={0}
            label="Uso"
            placeholder="Uso actual del enlace"
            value={usage}
            onChange={(e) => setUsage(e.target.value)}
          />

          {/* Capacidad */}
          <Input
            isRequired
            type="number"
            min={1}
            label="Capacidad"
            placeholder="Capacidad del enlace"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
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
            onPress={handleCreateLink}
            isDisabled={!isFormValid}
          >
            Crear enlace
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateEdgeModal;
