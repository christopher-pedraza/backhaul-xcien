import { Plus, Trash, Play } from "lucide-react";
import { FC } from "react";
import { useState } from "react";

import CalculateRouteModal from "../../CalculateRoute/CalculateRouteModal";

interface ToolBoxProps {
  onCreateNode: () => void;
  onCreateEdge: () => void;
  onDelete: () => void;
  isDeleteDisabled: boolean;
}

const ToolBox: FC<ToolBoxProps> = ({
  onCreateNode,
  onCreateEdge,
  onDelete,
  isDeleteDisabled,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* Modal */}
      <CalculateRouteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white p-2 rounded-xl shadow-md flex items-center space-x-4 relative">
          {/* Play button */}
          <button
            className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600"
            onClick={() => setIsModalOpen(true)}
          >
            <Play size={20} />
          </button>

          {/* Group wrapper for + and its dropdown */}
          <div className="relative group">
            <button
              className="p-2 rounded-full text-white hover:opacity-90"
              style={{ backgroundColor: "#1633b0" }}
            >
              <Plus size={20} />
            </button>

            {/* Dropdown shown on hover */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white border rounded shadow-md opacity-0 group-hover:opacity-100 group-hover:visible transition-all duration-200 invisible z-50 w-32">
              <button
                className="w-full px-4 py-2 hover:bg-gray-100 text-sm text-left"
                onClick={onCreateNode}
              >
                Crear nodo
              </button>
              <button
                className="w-full px-4 py-2 hover:bg-gray-100 text-sm text-left"
                onClick={onCreateEdge}
              >
                Crear enlace
              </button>
            </div>
          </div>

          {/* Delete button */}
          <button
            className={`p-2 rounded-full text-white ${
              isDeleteDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:opacity-90"
            }`}
            style={{ backgroundColor: "#b60e35" }}
            onClick={isDeleteDisabled ? undefined : onDelete}
            disabled={isDeleteDisabled}
          >
            <Trash size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default ToolBox;
