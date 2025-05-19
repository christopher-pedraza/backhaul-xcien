import { Accordion, AccordionItem, Chip } from "@heroui/react";

interface TabResumenProps {
  // TODO: Definir tipos correctos para los cambios
  cambiosCapacidadV: any[];
  cambiosCapacidadA: any[];
  cambiosConsumoV: any[];
  cambiosConsumoA: any[];
}

const Titulo = (cambiosV: any[], cambiosA: any[], texto: string) => {
  return (
    <>
      <span className="mr-2 text-lg">{texto}</span>
      {cambiosV.length > 0 ? (
        <Chip variant="flat" color="warning" className="mr-2" size="sm">
          {cambiosV.length}
        </Chip>
      ) : null}

      {cambiosA.length > 0 ? (
        <Chip variant="flat" color="success" size="sm">
          {cambiosA.length}
        </Chip>
      ) : null}
    </>
  );
};

export default function TabResumen({
  cambiosCapacidadV,
  cambiosCapacidadA,
  cambiosConsumoV,
  cambiosConsumoA,
}: TabResumenProps) {
  return (
    <div className="flex flex-col items-center p-4 h-full w-full">
      <h2 className="text-2xl font-bold mb-4">Resumen</h2>
      <Accordion selectionMode="multiple">
        <AccordionItem
          key="1"
          aria-label="Capacidades"
          title={Titulo(cambiosCapacidadV, cambiosCapacidadA, "Capacidades")}
        >
          {"HOla"}
        </AccordionItem>
        <AccordionItem
          key="2"
          aria-label="Consumo"
          title={Titulo(cambiosConsumoV, cambiosConsumoA, "Consumo")}
        >
          {"defaultContent"}
        </AccordionItem>
      </Accordion>
    </div>
  );
}
