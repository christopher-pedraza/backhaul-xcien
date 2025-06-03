import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useDisclosure } from "@heroui/react";
import { cn } from "@heroui/theme";
import { CirclePlus, Copy, Menu, Save, Trash } from "lucide-react";
import { FC, useState } from "react";
import CreateTopologyModal from "./CreateTopologyModal";
import useUpdateTopology from "@/hooks/topologies/useUpdateTopology";
import { useCyContext } from "@/hooks/useCyContext";
import { UpdateTopologyParams } from "@/types/Services";
import { convertCyElementsToAppElements } from "./utils";

interface Props {
  onCreatedTopology: (createdTopologyId: string) => void;
  onDeleteTopology: () => void;
  selectedTopologyId: string;
}

const TopologyOptions: FC<Props> = ({
  onCreatedTopology,
  onDeleteTopology,
  selectedTopologyId,
}) => {
  const { cy } = useCyContext();
  const {
    isOpen,
    onOpen: openCreateNewTopologyModal,
    onOpenChange,
  } = useDisclosure();
  const { mutate: updateTopology } = useUpdateTopology();

  // determine if the new topology should be empty or a copy of the current one
  const [createEmpty, setCreateEmpty] = useState<boolean>(false);

  const iconClasses = "text-default-500 pointer-events-none w-5 h-5";

  const handleUpdateTopology = () => {
    if (!cy) return;

    const elements = cy.elements();
    const convertedElements = convertCyElementsToAppElements(elements);

    const params: UpdateTopologyParams = {
      id: selectedTopologyId,
      elements: convertedElements,
    };

    updateTopology(params);
  };

  return (
    <>
      <Dropdown
        showArrow
        classNames={{
          base: "before:bg-default-200", // change arrow background
          content:
            "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
        }}
      >
        <DropdownTrigger>
          <Button isIconOnly variant="ghost">
            <Menu />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Dropdown menu with description"
          variant="faded"
        >
          <DropdownSection title="Acciones">
            <DropdownItem
              key="save"
              description="Guardar las modificaciones realizadas"
              startContent={<Save className={iconClasses} />}
              onPress={handleUpdateTopology}
            >
              Guardar Cambios
            </DropdownItem>
            <DropdownItem
              key="new-empty"
              description="Crear una nueva topología vacía"
              startContent={<CirclePlus className={iconClasses} />}
              onPress={() => {
                setCreateEmpty(true);
                openCreateNewTopologyModal();
              }}
            >
              Nueva Topología
            </DropdownItem>
            <DropdownItem
              key="new-copy"
              description="Crear una copia de la topología actual"
              startContent={<Copy className={iconClasses} />}
              onPress={() => {
                setCreateEmpty(false);
                openCreateNewTopologyModal();
              }}
            >
              Copiar Topología
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title="Zona de Riesgo">
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              description="Elimina la topología actual"
              startContent={
                <Trash className={cn(iconClasses, "text-danger")} />
              }
              onPress={onDeleteTopology}
            >
              Eliminar Topología
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
      <CreateTopologyModal
        isOpen={isOpen}
        onCreatedTopology={onCreatedTopology}
        onOpenChange={onOpenChange}
        createEmptyTopology={createEmpty}
      />
    </>
  );
};

export default TopologyOptions;
