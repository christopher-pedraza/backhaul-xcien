/* eslint-disable prettier/prettier */
import { FC, useState } from "react";
import CalculateRouteModal from "./CalculateRouteModal";

const CalculateRouteButton: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      {/* Modal */}
      <CalculateRouteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
    />

      {/* Button */}
      <button
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => setIsModalOpen(true)}
      >
        Calcular Ruta
      </button>
    </div>
  );
};

export default CalculateRouteButton;