import { FC, useState } from "react";
import Graph from "@/components/graph";
import { useCyContext } from "@/hooks/useCyContext";
import { getRandomPosition } from "./utils";
import SideBar from "@/components/SideBar/Sidebar";
import NodeModal from "@/components/modal/modal";
import LinkModal from "@/components/modal2/modal2";
import FloatingActionBar from "@/components/FloatingActionBar/FloatingActionBar";

interface Props {}

const IndexPage: FC<Props> = () => {
  const { cy } = useCyContext();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

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

  if (cy) {
    cy.on("tap", "node", (event) => {
      const id = event.target.id();
      setSelectedNode(id);
      if (!isOpen) setIsOpen(true);
    });

    cy.on("tap", "edge", (event) => {
      const id = event.target.id();
      setSelectedNode(id);
      if (!isOpen) setIsOpen(true);
    });
  }

  const addNode = () => setIsModalOpen(true);
  const addEdge = () => setIsEdgeModalOpen(true);

  const handleCreateNode = () => {
    if (!cy || !newNodeId.trim()) {
      setError("Node ID is required");
      return;
    }

    if (cy.getElementById(newNodeId).length > 0) {
      setError("Node ID already exists");
      return;
    }

    setError(null);
    cy.add({
      group: "nodes",
      data: { id: newNodeId, capacity, usage },
      position: getRandomPosition(cy),
    });

    selectedNodes.forEach((targetId) => {
      const edgeId = `${newNodeId}-${targetId}`;
      if (!cy.getElementById(edgeId).length) {
        cy.add({
          group: "edges",
          data: {
            id: edgeId,
            source: newNodeId,
            target: targetId,
            label: `${capacity}/${usage}`,
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
      setError("Source and target nodes are required");
      return;
    }

    const edgeId = `${sourceNode}-${targetNode}`;
    if (cy.getElementById(edgeId).length > 0) {
      setError("Edge already exists");
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
      setIsOpen(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      
      <Graph />

      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} cy={cy} selectedNode={selectedNode} />

      <NodeModal
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
        availableNodes={availableNodes}
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
      />

      {/* Modal de Confirmación de Eliminación */}
      {isDeleteModalOpen && selectedNode && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">¿Confirmar eliminación?</h2>
            <p className="mb-4">
              Estás a punto de eliminar el elemento <strong>{selectedNode}</strong>.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <FloatingActionBar
        onCreateNode={addNode}
        onCreateEdge={addEdge}
        onDelete={() => setIsDeleteModalOpen(true)}
      />
    </div>
  );
};

export default IndexPage;
