/* eslint-disable prettier/prettier */
import { FC, useEffect, useState } from "react";
import Graph from "@/components/graph";
import { useCyContext } from "@/hooks/useCyContext";
import { AlertProvider } from "@/context/AlertContext";
import { getBottomLeftPosition } from "./utils";
import Sidebar from "@/components/Sidebar/index";
import CreateNodeModal from "@/components/toolBox/CreateNodeModal/CreateNodeModal";
import LinkModal from "@/components/toolBox/CreatEdgeModal/CreateEdgeModal";
import FloatingActionBar from "@/components/toolBox/ToolBox/ToolBox";
import MyNavbar from "@/components/NavBar/NavBar";
import Selector from "@/components/Selector";
import useTopologyOptions from "@/hooks/topologies/useTopologyOptions";
import useTopology from "@/hooks/topologies/useTopology";
import DeleteConfirmModal from "@/components/toolBox/DeleteConfirmModal/DeleteConfirmModal";

import { useChangeLogContext } from "@/hooks/useChangeLogContext";
import { UserActionType } from "@/context/ChangeLogContext";

interface Props {}

// Función auxiliar: Devuelve el siguiente índice disponible para un enlace
function getNextEdgeIndex(source: string, target: string, cy: any): number {
  if (!cy) return 1;

  const existingEdges = cy.edges().filter((edge: any) => {
    const edgeSource = edge.data("source");
    const edgeTarget = edge.data("target");

    return (
      (edgeSource === source && edgeTarget === target) ||
      (edgeSource === target && edgeTarget === source)
    );
  });

  return existingEdges.length + 1;
}

// 🔍 Función auxiliar: Verifica si ya existe un nodo con ese NOMBRE
const normalizeName = (name: string): string => {
  return name.replace(/\s+/g, "").toLowerCase(); // Elimina espacios y convierte a minúsculas
};

const nodeNameExists = (name: string, cy: any): boolean => {
  if (!cy || !name.trim()) return false;

  const normalizedNameToCheck = normalizeName(name);

  return cy.nodes().some((node: any) => {
    const nodeName = node.data("name") || node.id();
    return normalizeName(nodeName) === normalizedNameToCheck;
  });
};

const IndexPage: FC<Props> = () => {
  const { cy } = useCyContext();
  const { topologyOptions, isLoading: isLoadingTopologyOptions } =
    useTopologyOptions();

  // Select Topology states
  const [selectedTopologyId, setSelectedTopologyId] = useState<string>("");
  const { data: selectedTopology } = useTopology(selectedTopologyId);

  const [isSidebarOpen, setSidebarIsOpen] = useState(false);
  const [wasTapped, setWasTapped] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Node modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNodeId, setNewNodeId] = useState("");
  const [capacity, setCapacity] = useState("");
  const [usage, setUsage] = useState("");
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Edge modal state
  const [isEdgeModalOpen, setIsEdgeModalOpen] = useState(false);
  const [sourceNode, setSourceNode] = useState("");
  const [targetNode, setTargetNode] = useState("");

  const { addAction } = useChangeLogContext();

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const availableNodes = cy
    ? cy.nodes().map((node) => ({
        id: node.id(),
        name: node.data("name") || node.id(),
      }))
    : [];

  const [selectedNodeType, setSelectedNodeType] = useState<string>("cloud");

  // Set the topology when the selectedTopologyId changes
  useEffect(() => {
    if (!selectedTopology || !cy) return;

    cy.json({ elements: selectedTopology.elements });
    cy.fit(undefined, 50);
  }, [selectedTopology, cy]);

  // Event listeners for node and edge taps
  useEffect(() => {
    if (!cy) return;

    const handleNodeTap = (event: any) => {
      const id = event.target.id();
      setSelectedNode(id);
      setSelectedType("node");
      if (!isSidebarOpen) {
        setWasTapped(true);
      }
    };

    const handleEdgeTap = (event: any) => {
      const id = event.target.id();
      setSelectedNode(id);
      setSelectedType("edge");
      if (!isSidebarOpen) {
        setWasTapped(true);
      }
    };

    cy.on("tap", "node", handleNodeTap);
    cy.on("tap", "edge", handleEdgeTap);

    return () => {
      cy.off("tap", "node", handleNodeTap);
      cy.off("tap", "edge", handleEdgeTap);
    };
  }, [cy, isSidebarOpen]);

  const addNode = () => {
    setNewNodeId("");
    setCapacity("");
    setUsage("");
    setSelectedNodeType("cloud"); // Resetear tipo al abrir
    setIsModalOpen(true);
  };

  const addEdge = () => setIsEdgeModalOpen(true);

  const handleCreateNode = () => {
    if (!cy || !newNodeId.trim()) {
      setError("El nombre del nodo es obligatorio");
      return;
    }

    if (nodeNameExists(newNodeId, cy)) {
      setError("Ya existe un nodo con este nombre");
      return;
    }

    const nodeId = `node-${Date.now()}`;

    setError(null);

    cy.add({
      group: "nodes",
      data: {
        id: nodeId,
        name: newNodeId,
        capacity,
        usage,
      },
      classes: selectedNodeType,
      position: getBottomLeftPosition(cy),
    });

    addAction({
      type: UserActionType.ADD_NODE,
      data: {
        name: newNodeId,
      },
    });

    // Crear enlaces con los nodos seleccionados
    selectedNodes.forEach((targetId) => {
      const index = getNextEdgeIndex(nodeId, targetId, cy);
      const edgeId = `${nodeId}-${targetId}-${index}`;

      if (!cy.getElementById(edgeId).length) {
        cy.add({
          group: "edges",
          data: {
            id: edgeId,
            source: nodeId,
            target: targetId,
            capacity,
            usage,
          },
        });
      }
    });

    setNewNodeId("");
    setCapacity("");
    setUsage("");
    setSelectedNodeType("cloud");
    setIsModalOpen(false);
  };

  const handleCreateLink = () => {
    if (!cy || !sourceNode || !targetNode) {
      setError("Los nodos origen y destino son obligatorios");
      return;
    }

    if (sourceNode === targetNode) {
      setError("Origen y destino no pueden ser el mismo nodo");
      return;
    }

    const index = getNextEdgeIndex(sourceNode, targetNode, cy);
    const edgeId = `${sourceNode}-${targetNode}-${index}`;

    cy.add({
      group: "edges",
      data: {
        id: edgeId,
        source: sourceNode,
        target: targetNode,
        label: `${capacity}/${usage}`,
        capacity,
        usage,
      },
    });

    addAction({
      type: UserActionType.ADD_EDGE,
      data: {
        source: sourceNode,
        target: targetNode,
        capacity: capacity,
        usage: usage,
      },
    });

    setSourceNode("");
    setTargetNode("");
    setCapacity("");
    setUsage("");
    setIsEdgeModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedNode && cy) {
      const connectedEdges = cy
        .getElementById(selectedNode)
        .connectedEdges()
        .map((edge: any) => edge.id());

      cy.getElementById(selectedNode).remove();

      if (selectedType === "edge") {
        addAction({
          type: UserActionType.REMOVE_EDGE,
          data: {
            name: elementName,
          },
        });
      } else if (selectedType === "node") {
        addAction({
          type: UserActionType.REMOVE_NODE,
          data: {
            name: elementName,
            removedEdges: connectedEdges,
          },
        });
      }

      setSelectedNode(null);
      setSidebarIsOpen(false);
      setIsDeleteModalOpen(false);
    }
  };

  const elementName = selectedNode
    ? cy?.getElementById(selectedNode)?.data("name") || selectedNode
    : "";

  return (
    <div className="flex-1 flex flex-col bg-dotted relative overflow-hidden">
      <MyNavbar />

      <Graph />

      <div className="absolute top-0 left-0 z-10 mt-[4rem] ml-2 w-1/6">
        <Selector
          options={topologyOptions}
          isLoadingOptions={isLoadingTopologyOptions}
          selectedValue={selectedTopologyId}
          setSelectedValue={setSelectedTopologyId}
        />
      </div>
      <AlertProvider>
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setSidebarIsOpen}
          wasTapped={wasTapped}
          setWasTapped={setWasTapped}
          selectedNode={selectedNode || ""}
          selectedType={selectedType || ""}
        />

        {/* Modal para crear nodo */}
        <CreateNodeModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          newNodeId={newNodeId}
          setNewNodeId={setNewNodeId}
          handleCreateNode={handleCreateNode}
          nodeExists={newNodeId.trim() !== "" && nodeNameExists(newNodeId, cy)}
          error={error}
          setError={setError}
          selectedType={selectedNodeType}
          setSelectedType={setSelectedNodeType}
        />

        <LinkModal
          isOpen={isEdgeModalOpen}
          setIsOpen={setIsEdgeModalOpen}
          sourceNode={sourceNode}
          setSourceNode={setSourceNode}
          targetNode={targetNode}
          setTargetNode={setTargetNode}
          capacity={capacity}
          setCapacity={setCapacity}
          usage={usage}
          setUsage={setUsage}
          handleCreateLink={handleCreateLink}
          availableNodes={availableNodes}
          error={error}
          setError={setError}
        />

        {/* Delete Confirm Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          elementId={selectedNode}
          elementName={elementName}
          elementType={selectedType as "node" | "edge"}
        />

        <FloatingActionBar
          onCreateNode={addNode}
          onCreateEdge={addEdge}
          onDelete={() => setIsDeleteModalOpen(true)}
          isDeleteDisabled={!selectedNode}
        />
      </AlertProvider>
    </div>
  );
};

export default IndexPage;
