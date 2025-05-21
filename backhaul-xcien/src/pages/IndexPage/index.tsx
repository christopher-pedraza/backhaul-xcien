/* eslint-disable prettier/prettier */
import { FC, useEffect, useState } from "react";
import Graph from "@/components/graph";
import { useCyContext } from "@/hooks/useCyContext";
import { getRandomPosition } from "./utils";
import Sidebar from "@/components/Sidebar/index";
import CreateNodeModal from "@/components/toolBox/CreateNodeModal/CreateNodeModal";
import LinkModal from "@/components/toolBox/CreatEdgeModal/CreateEdgeModal";
import FloatingActionBar from "@/components/toolBox/ToolBox/ToolBox";
import MyNavbar from "@/components/NavBar/NavBar";
import Selector from "@/components/Selector";
import useTopologyOptions from "@/hooks/topologies/useTopologyOptions";
import useTopology from "@/hooks/topologies/useTopology";
import DeleteConfirmModal from "@/components/toolBox/DeleteConfirmModal/DeleteConfirmModal";

interface Props {}

const IndexPage: FC<Props> = () => {
  const { cy } = useCyContext();
  const { topologyOptions, isLoading: isLoadingTopologyOptions } =
    useTopologyOptions();

  // Select Topology states
  const [selectedTopologyId, setSelectedTopologyId] = useState<string>("");
  const { data: selectedTopology } = useTopology(selectedTopologyId);

  const [isSidebarOpen, setSidebarIsOpen] = useState(false);
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

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const availableNodes = cy ? cy.nodes().map((node) => node.id()) : [];

  // Set the topology when the selectedTopologyId changes
  useEffect(() => {
    if (!selectedTopology || !cy) return;

    cy.json({ elements: selectedTopology.elements });
    cy.fit(undefined, 50);

    console.log("Topology set:", selectedTopology);
    console.log("Cy elements:", cy.elements().jsons());
  }, [selectedTopology, cy]);

  // Set event listeners for node and edge taps with proper cleanup
  useEffect(() => {
    if (!cy) return;

    const handleNodeTap = (event: any) => {
      const id = event.target.id();
      setSelectedNode(id);
      setSelectedType("node");
      if (!isSidebarOpen) setSidebarIsOpen(true);
    };

    const handleEdgeTap = (event: any) => {
      const id = event.target.id();
      setSelectedNode(id);
      setSelectedType("edge");
      if (!isSidebarOpen) setSidebarIsOpen(true);
    };

    cy.on("tap", "node", handleNodeTap);
    cy.on("tap", "edge", handleEdgeTap);

    // Cleanup listeners on unmount or when cy changes
    return () => {
      cy.off("tap", "node", handleNodeTap);
      cy.off("tap", "edge", handleEdgeTap);
    };
  }, [cy, isSidebarOpen]);

  const addNode = () => setIsModalOpen(true);
  const addEdge = () => setIsEdgeModalOpen(true);

  const handleCreateNode = () => {
    if (!cy || !newNodeId.trim()) {
      setError("El ID del nodo es obligatorio");
      return;
    }

    if (cy.getElementById(newNodeId).length > 0) {
      setError("Ya existe un nodo con ese ID");
      return;
    }

    setError(null);
    cy.add({
      group: "nodes",
      data: {
        id: newNodeId,
        name: newNodeId,
        capacity,
        usage,
      },
      position: getRandomPosition(cy),
    });

    // Crear enlaces con los nodos seleccionados
    selectedNodes.forEach((targetId) => {
      const edgeId = `${newNodeId}-${targetId}`;
      if (!cy.getElementById(edgeId).length) {
        cy.add({
          group: "edges",
          data: {
            id: edgeId,
            source: newNodeId,
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
    setSelectedNodes([]);
    setIsModalOpen(false);
  };

  const handleCreateLink = () => {
    if (!cy || !sourceNode || !targetNode) {
      setError("Los nodos origen y destino son obligatorios");
      return;
    }

    const edgeId = `${sourceNode}-${targetNode}`;
    if (cy.getElementById(edgeId).length > 0) {
      setError("Ya existe una conexión entre estos nodos");
      return;
    }

    setError(null);
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

    setSourceNode("");
    setTargetNode("");
    setCapacity("");
    setUsage("");
    setIsEdgeModalOpen(false);
  };

  const handleDelete = () => {
    if (selectedNode && cy) {
      cy.getElementById(selectedNode).remove();
      setSelectedNode(null);
      setSidebarIsOpen(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-dotted relative">
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

      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setSidebarIsOpen}
        selectedNode={selectedNode || ""}
        selectedType={selectedType || ""}
      />

      <CreateNodeModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        newNodeId={newNodeId}
        setNewNodeId={setNewNodeId}
        capacity={capacity}
        setCapacity={setCapacity}
        usage={usage}
        setUsage={setUsage}
        selectedNodes={selectedNodes}
        setSelectedNodes={setSelectedNodes}
        handleCreateNode={handleCreateNode}
        error={error}
        setError={setError}
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

      {/* Aquí usamos el componente externo DeleteConfirmModal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        elementId={selectedNode}
        elementType={selectedType as "node" | "edge"}
      />

      <FloatingActionBar
        onCreateNode={addNode}
        onCreateEdge={addEdge}
        onDelete={() => setIsDeleteModalOpen(true)}
        isDeleteDisabled={!selectedNode} // Deshabilita si no hay nodo seleccionado
      />
    </div>
  );
};

export default IndexPage;
