import { Plus, Trash, Play } from "lucide-react";
import { FC, useState } from "react";

import CalculateRouteModal from "../CalculateRoute/CalculateRouteModal";

const BottomActions: FC<{
  onCreateNode: () => void;
  onCreateEdge: () => void;
  onDelete: () => void;
}> = ({ onCreateNode, onCreateEdge, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeDropdown = () => {
    setTimeout(() => {
      const dropdown = document.querySelector(".dropdown");

      if (dropdown) {
        dropdown.classList.remove("opacity-100", "visible");
        dropdown.classList.add("opacity-0", "invisible");
      }
    }, 100);
  };

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
          <div className="relative group">
            <button className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600">
              <Play size={20} />
            </button>
            {/* Dropdown shown on hover */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white border rounded shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 w-40 dropdown">
              <button
                className="w-full px-4 py-2 hover:bg-gray-100 text-sm text-left "
                onClick={() => {
                  setIsModalOpen(true);
                  closeDropdown();
                }}
              >
                Configurar Ponderación
              </button>
              <button
                className="w-full px-4 py-2 hover:bg-gray-100 text-sm text-left"
                onClick={() => {
                  setIsModalOpen(true);
                  closeDropdown();
                }}
              >
                Calcular Ruta
              </button>
            </div>
          </div>

          {/* Group wrapper for + and its dropdown */}
          <div className="relative group">
            <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600">
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
            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600"
            onClick={onDelete}
          >
            <Trash size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default BottomActions;
