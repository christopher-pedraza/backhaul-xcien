import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { AlertCardData } from "../context/AlertContext";
import { UserAction } from "../context/ChangeLogContext";

export function generatePDFReport(
  alertCards: AlertCardData[],
  actions: UserAction[],
) {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("Reporte de Alertas y Cambios", 14, 18);

  // Section: Alertas
  doc.setFontSize(14);
  doc.text("Alertas", 14, 30);

  let y = 50;
  if (alertCards.length > 0) {
    // Only call autoTable once and capture its return value
    autoTable(doc, {
      startY: 34,
      head: [
        [
          "Enlace",
          "Porcentaje (%)",
          "Uso (MB)",
          "Capacidad Actual",
          "Capacidad Recomendada",
        ],
      ],
      body: alertCards.map((a) => [
        a.enlace,
        a.porcentaje.toString(),
        a.uso.toString(),
        a.capacidadActual,
        a.capacidadRecomendada,
      ]),
    });
    y = (doc as any).lastAutoTable?.finalY
      ? (doc as any).lastAutoTable.finalY + 10
      : 50;
  } else {
    doc.setFontSize(12);
    doc.text("No hay alertas.", 14, 40);
    y = 50;
  }

  doc.setFontSize(14);
  doc.text("Historial de Cambios", 14, y);

  if (actions.length > 0) {
    autoTable(doc, {
      startY: y + 4,
      head: [["ID", "Tipo", "Fecha/Hora", "Datos"]],
      body: actions.map((action) => [
        action.id.toString(),
        action.type,
        action.timestamp,
        JSON.stringify(action.data, null, 2),
      ]),
      styles: { fontSize: 8 },
      columnStyles: {
        3: { cellWidth: 60 },
      },
    });
  } else {
    doc.setFontSize(12);
    doc.text("No hay cambios registrados.", 14, y + 10);
  }

  doc.save("reporte_alertas_cambios.pdf");
}
