import ChangeCard from "../CardsChanges/ChangeCard";

const ChangesList = () => {
  const changes = [
    {
      id: 1,
      title: "Enlace eliminado",
      type: "error",
      details: ["Carrier Movistar - Carrier Telcel"],
      timestamp: "8:00:34 - 25 de mayo, 2025",
    },
    {
      id: 2,
      title: "Nodo creado",
      type: "success",
      details: ["Carrier Axtel"],
      timestamp: "8:02:38 - 25 de mayo, 2025",
    },
    {
      id: 3,
      title: "Enlace editado",
      type: "info",
      details: ["Axtel + Nestle", "Capacidad: 400 → 400", "Uso: 400 → 200"],
      timestamp: "8:02:38 - 25 de mayo, 2025",
    },
    {
      id: 4,
      title: "Nodo editado",
      type: "info",
      details: ["Nuevo nombre", "Carrier Axtel"],
      timestamp: "8:02:38 - 25 de mayo, 2025",
    },
    {
      id: 5,
      title: "Cliente agregado",
      type: "success",
      details: [
        "OXXO Gas",
        "Nodo: Carrier Axtel",
        "Capacidad vendida: 400 → 800",
        "Uso: 400 → 200",
      ],
      timestamp: "8:02:38 - 25 de mayo, 2025",
    },
    {
      id: 6,
      title: "Cliente eliminado",
      type: "error",
      details: ["OXXO Gas"],
      timestamp: "8:00:34 - 25 de mayo, 2025",
    },
    {
      id: 7,
      title: "Nodo eliminado",
      type: "error",
      details: [
        "Enlace eliminado: Axtel + Apodaca",
        "Enlace eliminado: Axtel - Apodaca",
      ],
      timestamp: "8:00:34 - 25 de mayo, 2025",
    },
  ];

  return (
    <div className="changes-list max-w-2xl mx-auto my-6 relative h-[80vh]">
      {/* Contenedor con scroll */}
      <div className="max-h-full overflow-y-auto p-2 space-y-3 relative z-10">
        {changes.map((change) => (
          <ChangeCard
            key={change.id}
            title={change.title}
            type={change.type}
            details={change.details}
            timestamp={change.timestamp}
            cardIndex={change.id}
          />
        ))}
      </div>

      {/* Degradado al fondo */}
      <div className="pointer-events-none absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent z-20" />
    </div>
  );
};

export default ChangesList;
