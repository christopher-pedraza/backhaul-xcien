import { FC } from "react";

interface LinkModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  sourceNode: string;
  setSourceNode: (value: string) => void;
  targetNode: string;
  setTargetNode: (value: string) => void;
  capacity: string;
  setCapacity: (value: string) => void;
  usage: string;
  setUsage: (value: string) => void;
  handleCreateLink: () => void;
  availableNodes: string[]; // Nodos disponibles para dropdown
  error: string | null;
}

const LinkModal: FC<LinkModalProps> = ({
  isOpen,
  setIsOpen,
  sourceNode,
  setSourceNode,
  targetNode,
  setTargetNode,
  capacity,
  setCapacity,
  usage,
  setUsage,
  handleCreateLink,
  availableNodes,
  error
}) => {
  if (!isOpen) return null;

  const handleClickOutside = (event: React.MouseEvent) => {
    if ((event.target as HTMLElement).classList.contains("modal-overlay")) {
      setIsOpen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center modal-overlay z-50"
      onClick={handleClickOutside}
    >
      <div className="bg-white p-6 rounded shadow-lg w-96" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl mb-4 font-semibold">Create Link</h3>

        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

        <label htmlFor="source" className="block mb-2 font-medium">
          Source Node
        </label>
        <select
          id="source"
          value={sourceNode}
          onChange={(e) => setSourceNode(e.target.value)}
          className="border p-2 mb-4 w-full"
        >
          <option value="">Select source</option>
          {availableNodes.map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>

        <label htmlFor="target" className="block mb-2 font-medium">
          Target Node
        </label>
        <select
          id="target"
          value={targetNode}
          onChange={(e) => setTargetNode(e.target.value)}
          className="border p-2 mb-4 w-full"
        >
          <option value="">Select target</option>
          {availableNodes.map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>

        <label htmlFor="capacity" className="block mb-2 font-medium">
          Capacity
        </label>
        <input
          id="capacity"
          type="text"
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="border p-2 mb-4 w-full"
          placeholder="Capacity"
        />

        <label htmlFor="usage" className="block mb-2 font-medium">
          Usage
        </label>
        <input
          id="usage"
          type="text"
          value={usage}
          onChange={(e) => setUsage(e.target.value)}
          className="border p-2 mb-4 w-full"
          placeholder="Usage"
        />

        <div className="flex justify-between">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={handleCreateLink}
            disabled={!sourceNode || !targetNode}
          >
            Create Link
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkModal;
