import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmModal {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  elementId: string | null;
  elementType: "node" | "edge" | null;
}

const DeleteConfirmModal: FC<DeleteConfirmModal> = ({
  isOpen,
  onClose,
  onConfirm,
  elementId,
  elementType,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Confirmar eliminación?</DialogTitle>
        </DialogHeader>
        <p>
          Estás a punto de eliminar el{" "}
          {elementType === "node" ? "nodo" : "enlace"}{" "}
          <strong>{elementId}</strong>.
        </p>
        <DialogFooter>
          <Button variant="destructive" onClick={onConfirm}>
            Eliminar
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmModal;
