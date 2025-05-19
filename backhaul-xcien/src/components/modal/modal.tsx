import { FC } from "react";

interface NodeModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  newNodeId: string;
  setNewNodeId: (value: string) => void;
  capacity: string;
  setCapacity: (value: string) => void;
  usage: string;
  setUsage: (value: string) => void;
  selectedNodes: string[];
  setSelectedNodes: (value: string[]) => void;
  handleCreateNode: () => void;
  availableNodes: string[]; // Nodos disponibles para seleccionar
}

const NodeModal: FC<NodeModalProps> = ({
  isOpen,
  setIsOpen,
  newNodeId,
  setNewNodeId,
  // selectedNodes,
  // setSelectedNodes,
  handleCreateNode,
}) => {
  if (!isOpen) return null; // Si no está abierto, no renderizamos nada

  // const handleSelectNode = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = event.target.value;
  //   if (event.target.checked) {
  //     setSelectedNodes([...selectedNodes, value]);
  //   } else {
  //     setSelectedNodes(selectedNodes.filter((id) => id !== value));
  //   }
  // };

  const handleClickOutside = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).classList.contains("modal-overlay")) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center modal-overlay"
      onClick={handleClickOutside}
    >
      <div
        className="bg-white p-6 rounded shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl mb-4">Enter Node Details</h3>

        <label htmlFor="nodeId" className="block mb-2">
          Node ID <span className="text-red-500">*</span>
        </label>
        <input
          id="nodeId"
          type="text"
          value={newNodeId}
          onChange={(e) => setNewNodeId(e.target.value)}
          className="border p-2 mb-4 w-full"
          placeholder="Node ID"
        />

        <div className="flex justify-between">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => setIsOpen(false)} // Cierra el modal
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={handleCreateNode}
            disabled={!newNodeId.trim()}
          >
            Create Node
          </button>
        </div>
      </div>
    </div>
  );
};

export default NodeModal;
