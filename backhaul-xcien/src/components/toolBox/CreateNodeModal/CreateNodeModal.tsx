import { FC } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";

interface NodeType {
  id: string;
  name: string;
  icon: string;
}

const nodeTypes: NodeType[] = [
  { id: "cloud", name: "Carrier", icon: "/icons/cloud.svg" },
  { id: "router", name: "Router", icon: "/icons/router.svg" },
  { id: "switch", name: "Switch", icon: "/icons/switch.svg" },
];

interface CreateNodeModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  newNodeId: string;
  setNewNodeId: (value: string) => void;
  handleCreateNode: () => void;
  nodeExists: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
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
  selectedType,
  setSelectedType,
}) => {
  const isFormValid = newNodeId.trim() !== "" && selectedType;

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen} placement="center">
      <ModalContent>
        <ModalHeader>Crear Nodo</ModalHeader>

        <ModalBody className="space-y-4">
          {/* Campo de nombre */}
          <Input
            isRequired
            label="Nombre del Nodo"
            placeholder="Ej. Carrier Movistar"
            value={newNodeId}
            onChange={(e) => {
              setNewNodeId(e.target.value);
              if (error) setError(null);
            }}
            isInvalid={!!error}
          />

          {/* Dropdown de tipos */}
          <Select
            isRequired
            label="Tipo de Nodo"
            selectedKeys={[selectedType]}
            onSelectionChange={(keys) => {
              const [value] = Array.from(keys);
              setSelectedType(value as string);
            }}
            // ✅ Asegura que muestre el valor seleccionado
            renderValue={() => {
              const selected = nodeTypes.find((t) => t.id === selectedType);
              if (!selected) return "Selecciona un tipo";
              return (
                <div className="flex items-center gap-2">
                  <img src={selected?.icon} alt="" className="w-5 h-5" />
                  <span>{selected.name}</span>
                </div>
              );
            }}
          >
            {nodeTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                <div className="flex items-center gap-2">
                  <img src={type.icon} alt={type.name} className="w-5 h-5" />
                  <span>{type.name}</span>
                </div>
              </SelectItem>
            ))}
          </Select>

          {/* Mensaje de error */}
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button color="default" variant="flat" onPress={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button color="primary" onPress={handleCreateNode} isDisabled={!isFormValid}>
            Crear Nodo
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateNodeModal;