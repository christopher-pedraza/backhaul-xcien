import { FC } from "react";
import "../CardsChanges/ChangerCard.css";

interface ChangeCardProps {
  title: string;
  type: "success" | "info" | "warning" | "error";
  details?: string[];
  timestamp?: string;
  cardIndex: number;
}

const ChangeCard: FC<ChangeCardProps> = ({
  title,
  type,
  details = [],
  timestamp,
  cardIndex,
}) => {
  const getTypeColor = () => {
    switch (type) {
      case "success":
        return "bg-green-600 text-white";
      case "info":
        return "bg-blue-600 text-white";
      case "warning":
        return "bg-yellow-500 text-white";
      case "error":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  return (
    <div className="outer_container_change-card">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {/* ID Box */}
          <div
            className={`id-box-change-card ${getTypeColor()} w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold`}
          >
            {cardIndex}
          </div>

          {/* Título */}
          <h6 className={`titulo-change-card ${getTypeColor()}`}>{title}</h6>
        </div>

        {/* Detalles */}
        {details.length > 0 && (
          <ul className="text-sm text-gray-700 mt-1">
            {details.map((detail, i) => {
            const [label, ...rest] = detail.split(":");
            const value = rest.join(":").trim(); // para valores con ":" en medio

            return (
              <li key={i}>
                <span style={{ fontWeight: 550 }}>{label}:</span> {value}
              </li>
            );
       })}
          </ul>
        )}


        {/* Timestamp */}
        {timestamp && (
          <small className="text-xs text-gray-500 mt-1">{timestamp}</small>
        )}
      </div>
    </div>
  );
};

export default ChangeCard;
