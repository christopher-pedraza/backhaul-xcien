import { Button, useDisclosure } from "@heroui/react";
import { useCyContext } from "@/hooks/useCyContext";
import { useState, useEffect } from "react";

// Tabs
import EdgeTab from "../EdgeConfigurationTab";
import NodeTab from "../NodeConfigurationTab";

// Modals
import ChangeNameModal from "../ChangeNameModal";

// Icons
import PencilIcon from "../Icons/PencilIcon";

// Contexts
import { useChangeLogContext } from "@/hooks/useChangeLogContext";
import { UserActionType } from "@/context/ChangeLogContext";

interface TabConfiguracionProps {
  selectedNode: string;
  selectedType: string;
}

export default function TabConfiguracion({
  selectedNode,
  selectedType,
}: TabConfiguracionProps) {
  const { cy } = useCyContext();
  if (!cy) return null;

  const { addAction } = useChangeLogContext();

  const {
    isOpen: isOpenName,
    // onOpen: onOpenName,
    onOpenChange: onOpenChangeName,
  } = useDisclosure();

  const [node_data, setNodeData] = useState(null);

  const [name, setName] = useState("");

  useEffect(() => {
    const node = cy.getElementById(selectedNode);
    if (node) {
      console.log("Node data:", node.data());
      setNodeData(node.data());
    }
  }, [selectedNode, cy]);

  useEffect(() => {
    if (!node_data) {
      return;
    }
    if (selectedType == "node") {
      setName(node_data["name"]);
    } else if (selectedType == "edge") {
      setName(node_data["id"]);
    }
  }, [node_data]);

  const confirmSaveName = (newName: string) => {
    if (!node_data) {
      return;
    }
    console.log("Before", cy.getElementById(selectedNode).data());
    cy.getElementById(selectedNode).data({
      name: newName,
    });
    console.log("After", cy.getElementById(selectedNode).data());

    if (selectedType == "node") {
      if (name != newName) {
        addAction({
          type: UserActionType.EDIT_NODE,
          data: {
            oldName: name,
            newName: newName,
          },
        });
        setName(newName);
      }
    } else if (selectedType == "edge") {
      const capacity: string = node_data["capacity"] || "";
      const strCapacity: string = capacity.toString();
      const usage: string = node_data["usage"] || "";
      const strUsage: string = usage.toString();

      const nameChanged = node_data["id"] !== newName;
      const capacityChanged = strCapacity !== strCapacity;
      const usageChanged = strUsage !== strUsage;

      if (nameChanged || capacityChanged || usageChanged) {
        addAction({
          type: UserActionType.EDIT_EDGE,
          data: {
            oldName: node_data["id"] || "",
            newName: newName,
            oldCapacity: strCapacity,
            newCapacity: strCapacity,
            oldUsage: strUsage,
            newUsage: strUsage,
          },
        });
        setName(newName);
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-4 h-full">
      <Button
        endContent={selectedType == "node" ? <PencilIcon /> : null}
        className="bg-transparent mb-4"
        onPress={selectedType == "node" ? onOpenChangeName : undefined}
      >
        <h1 className="text-xl font-bold text-ellipsis whitespace-nowrap overflow-hidden max-w-[300px]">
          {name}
        </h1>
      </Button>

      {selectedType == "node" ? (
        <NodeTab selectedNode={selectedNode} node_data={node_data} />
      ) : selectedType == "edge" ? (
        <EdgeTab selectedNode={selectedNode} node_data={node_data} />
      ) : null}

      <ChangeNameModal
        isOpen={isOpenName}
        onOpenChange={onOpenChangeName}
        onConfirm={confirmSaveName}
        name={name}
      />
    </div>
  );
}
