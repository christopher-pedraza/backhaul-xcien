import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
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
  onOpen,
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
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              ¿Guardar cambios?
            </ModalHeader>
            <ModalBody>
              <p>
                ¿Estás seguro de que deseas guardar los cambios realizados en la
                configuración? Esta acción no se puede deshacer.
              </p>
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
