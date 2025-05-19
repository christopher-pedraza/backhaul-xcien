/* eslint-disable prettier/prettier */
import { FC, useState, useRef, useEffect } from "react";
import {Slider} from "@heroui/slider";

interface CalculateRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalculateRouteModal: FC<CalculateRouteModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [capacityValue, setCapacityValue] = useState(70);
  const [distanceValue, setDistanceValue] = useState(30);

  const modalRef = useRef<HTMLDivElement>(null);

  // Handle slider changes
  const handleCapacityChange = (value: number) => {
    setCapacityValue(value);
    setDistanceValue(100 - value);
  };

  const handleDistanceChange = (value: number) => {
    setDistanceValue(value);
    setCapacityValue(100 - value);
  };

  // Detectar clics fuera del modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Agregar el event listener cuando el modal está abierto
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Limpiar el event listener cuando el modal se cierra
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div ref={modalRef} className="absolute bottom-20 right-1/2 bg-white border rounded shadow-md p-4 w-64">
      <h3 className="text-lg font-semibold mb-4">Modificar Cálculo</h3>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor="capacity-slider">Capacidad</label>
        <Slider
          className="w-full"
          id="capacity-slider"
          maxValue={100}
          minValue={0}
          step={1}
          value={capacityValue}
          onChange={(value) => {
          if (typeof value === "number") {
            handleCapacityChange(value);
          }
          }}
        />
        <span className="text-sm">{capacityValue}%</span>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2" htmlFor="distance-slider">Distancia</label>
        <Slider
          className="w-full"
          id="distance-slider"
          maxValue={100}
          minValue={0}
          step={1}
          value={distanceValue}
          onChange={(value) => {
          if (typeof value === "number") {
            handleDistanceChange(value);
          }
          }}
        />
        <span className="text-sm">{distanceValue}%</span>
      </div>
    </div>
  );
};

export default CalculateRouteModal;
