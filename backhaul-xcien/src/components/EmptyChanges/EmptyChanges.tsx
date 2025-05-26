import { Smile } from "lucide-react";
import "./EmptyChanges.css";

interface EmptyChangesProps {
  message?: string;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export default function EmptyChanges({
  message = "No hay datos disponibles.",
  Icon = Smile,
}: EmptyChangesProps) {
  return (
    <div className="emptyChangesContainer">
      <Icon className="emptyChangesIcon" />
      <span>{message}</span>
    </div>
  );
}
