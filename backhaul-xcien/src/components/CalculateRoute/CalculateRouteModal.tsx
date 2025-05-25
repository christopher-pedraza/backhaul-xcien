import { FC, useState, useRef, useEffect } from "react";
import { Slider } from "@heroui/slider";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { useFlowSolver } from "@/hooks/FlowSolver";
import { useAlerts } from "@/context/AlertContext";

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

  // Estado para controlar si se está calculando la ruta
  const [isCalculating, setIsCalculating] = useState(false);

  const { setAlertsFromResults } = useAlerts();

  const { solution, loading, computeFlow } = useFlowSolver();

  const onTest = async () => {
    try {
      const results = await computeFlow();
      console.log("Flow calculation results:", results);
      setAlertsFromResults(results);
    } catch (err) {
      console.error("Error calculating route:", err);
    }
  };

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
    <div
      ref={modalRef}
      className="absolute bottom-20 right-1/2 translate-x-1/2 bg-white border rounded shadow-md p-4 w-64"
    >
      {/* Contenido del modal */}
      {isCalculating ? (
        // Animación de búsqueda en nodos usando DotLottieReact
        <div className="flex flex-col items-center justify-center space-y-2">
          <DotLottieReact
            src="https://lottie.host/3418d92c-56ca-4d1a-85fd-787a7d16584c/IGVtAJgxNy.lottie "
            loop
            autoplay
            style={{ width: "100%", maxWidth: "550px" }}
          />
          <p className="text-m text-gray-600">Buscando rutas...</p>
        </div>
      ) : (
        // Sliders y botón "Calcular Ruta"
        <>
          {/* Título */}
          <h3 className="text-lg font-semibold mb-4">Modificar Cálculo</h3>
          <div className="mb-4">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="capacity-slider"
            >
              Capacidad
            </label>
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
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="distance-slider"
            >
              Distancia
            </label>
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

          {/* Botón "Calcular Ruta" */}
          <div className="mt-6 flex justify-end">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300 ease-in-out"
              onClick={() => {
                setIsCalculating(true); // Cambia el estado a calcular
                setTimeout(() => {
                  onTest(); // Llama a la función de calculo de flujo
                  console.log("Ruta calculada");
                  setIsCalculating(false); // Simula el cálculo después de 5 segundos
                  onClose(); // Cierra el modal
                }, 2000);
              }}
            >
              Calcular Ruta
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CalculateRouteModal;
