import { FC } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  elementId: string | null;
  elementType: "node" | "edge" | null;
}

const DeleteConfirmModal: FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  elementId,
  elementType,
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} placement="center">
      <ModalContent>
        <ModalHeader>Eliminar {elementType === "node" ? "Nodo" : "Enlace"}</ModalHeader>

        <ModalBody className="flex flex-col gap-4">
          <p className="text-gray-700 text-sm leading-relaxed">
            ¿Estás seguro de que deseas eliminar el{" "}
            <strong>{elementType === "node" ? "nodo" : "enlace"}</strong>{" "}
            <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-red-600">
              {elementId}
            </span>
            ?
          </p>
          <p className="text-gray-500 text-xs">
            Esta acción no se puede deshacer.
          </p>
        </ModalBody>

        <ModalFooter>
          <Button color="default" variant="flat" onPress={onClose}>
            Cancelar
          </Button>
          <Button color="danger" onPress={onConfirm}>
            Eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmModal;