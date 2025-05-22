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
      setNodeData(node.data());
    }
  }, [selectedNode, cy]);

  useEffect(() => {
    if (!node_data) {
      return;
    }
    if (selectedType == "node") {
      setName(node_data["name"] || "");
    } else if (selectedType == "edge") {
      setName(node_data["id"]);
    }
  }, [node_data]);

  const confirmSaveName = (newName: string) => {
    if (!node_data) {
      return;
    }
    cy.getElementById(selectedNode).data({
      name: newName,
    });
    setName(newName);
    if (selectedType == "node") {
      addAction({
        type: UserActionType.EDIT_NODE,
        data: {
          oldName: name,
          newName: newName,
        },
      });
    } else if (selectedType == "edge") {
      addAction({
        type: UserActionType.EDIT_EDGE,
        data: {
          oldName: node_data?.id || "",
          newName: newName,
          oldCapacity: node_data?.capacity.toString() || "",
          newCapacity: node_data?.capacity.toString() || "",
          oldUsage: node_data?.usage.toString() || "",
          newUsage: node_data?.usage.toString() || "",
        },
      });
    }
  };

  return (
    <div className="flex flex-col items-center p-4 h-full">
      <Button
        endContent={<PencilIcon />}
        className="bg-transparent mb-4"
        onPress={onOpenChangeName}
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
