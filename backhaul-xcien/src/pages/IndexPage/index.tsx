import { FC, useState } from "react";
import Graph from "@/components/graph";
import { useCyContext } from "@/hooks/useCyContext";
import { getRandomPosition } from "./utils";
import SideBar from "@/components/SideBar/Sidebar";
import NodeModal from "@/components/modal/modal";
import LinkModal from "@/components/modal2/modal2"; // Asegúrate de tenerlo importado correctamente

interface Props {}

const IndexPage: FC<Props> = () => {
  const { cy } = useCyContext();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

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

  const addNode = () => {
    setIsModalOpen(true);
  };

  const addEdge = () => {
    setIsEdgeModalOpen(true);
  };

  const handleCreateNode = () => {
    if (!cy) return;

    if (!newNodeId.trim()) {
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
    if (!cy) return;

    if (!sourceNode || !targetNode) {
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

    // Reset states
    setSourceNode("");
    setTargetNode("");
    setCapacity("");
    setUsage("");
    setIsEdgeModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex gap-2 p-2">
        <button className="bg-blue-500 text-white p-2 rounded" onClick={addNode}>
          Add Node
        </button>
        <button className="bg-green-500 text-white p-2 rounded" onClick={addEdge}>
          Add Edge
        </button>
      </div>

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
    </div>
  );
};

export default IndexPage;
