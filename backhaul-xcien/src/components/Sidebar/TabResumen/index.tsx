import ChangesList from "@/components/CardsChanges/ChangesList";
import "./TabResumen.css";
interface TabResumenProps {
  // TODO: Definir tipos correctos para los cambios
  cambiosCapacidadV: any[];
  cambiosCapacidadA: any[];
  cambiosConsumoV: any[];
  cambiosConsumoA: any[];
}

export default function TabResumen({}: TabResumenProps) {
  return (
    <div>
      <div className="title-changes-tab">
        <h1>Cambios realizados</h1>
      </div>
      <ChangesList></ChangesList>
    </div>
  );
}
