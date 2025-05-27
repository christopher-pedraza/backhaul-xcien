import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  onOpenChange,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const confirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const cancel = () => {
    onCancel();
    onOpenChange(false);
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
              ¿Eliminar punto de acceso?
            </ModalHeader>
            <ModalBody>
              <p>
                ¿Estás seguro de que deseas eliminar este punto de acceso? Esta
                acción no se puede deshacer y se eliminarán todos los datos
                asociados a este.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={cancel}>
                Cancelar
              </Button>
              <Button color="danger" onPress={confirm}>
                Eliminar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
