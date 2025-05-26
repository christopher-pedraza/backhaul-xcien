import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { AlertCardData } from "../context/AlertContext";
import { UserAction } from "../context/ChangeLogContext";

export function generatePDFReport(
  alertCards: AlertCardData[],
  actions: UserAction[],
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const now = new Date();
  const reportDate = now.toLocaleString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Header: Logo (optional, placeholder rectangle) and Title
  // Replace with your logo if you have a base64 image string
  // doc.addImage(logoBase64, 'PNG', 14, 10, 30, 15);
  doc.setFillColor(41, 128, 185); // Executive blue
  doc.rect(0, 0, pageWidth, 25, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text("Reporte Ejecutivo de Alertas y Cambios", pageWidth / 2, 16, {
    align: "center",
  });
  doc.setFontSize(10);
  doc.text(`Generado: ${reportDate}`, pageWidth - 14, 22, { align: "right" });
  doc.setTextColor(0, 0, 0);

  // Summary Section
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Resumen", 14, 32);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Total de alertas: ${alertCards.length}`, 14, 39);
  doc.text(`Total de cambios: ${actions.length}`, 14, 45);

  // Section: Alertas
  let y = 55;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Alertas", 14, y);
  doc.setFont("helvetica", "normal");
  y += 4;

  if (alertCards.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [
        [
          "Enlace",
          "% Uso",
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
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 11,
      },
      bodyStyles: {
        fontSize: 10,
        lineColor: [220, 220, 220],
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
      styles: { cellPadding: 2 },
      theme: "grid",
    });
    y = (doc as any).lastAutoTable?.finalY
      ? (doc as any).lastAutoTable.finalY + 12
      : y + 40;
  } else {
    doc.setFontSize(11);
    doc.text("No hay alertas.", 14, y + 8);
    y += 20;
  }

  // Section: Cambios
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Historial de Cambios", 14, y);
  doc.setFont("helvetica", "normal");
  y += 4;

  function formatActionData(action: UserAction): string {
    switch (action.type) {
      case "ADD_NODE":
        return `Nodo agregado: ${(action.data as any).name}`;
      case "EDIT_NODE":
        return `Nodo editado: ${(action.data as any).oldName} → ${(action.data as any).newName}`;
      case "REMOVE_NODE":
        return (
          `Nodo eliminado: ${(action.data as any).name}` +
          ((action.data as any).removedEdges?.length
            ? ` (Enlaces eliminados: ${(action.data as any).removedEdges.join(", ")})`
            : "")
        );
      case "ADD_EDGE":
        return `Enlace agregado: ${(action.data as any).source} → ${(action.data as any).target}, Capacidad: ${(action.data as any).capacity}, Uso: ${(action.data as any).usage}`;
      case "EDIT_EDGE":
        return `Enlace editado: ${(action.data as any).oldName} → ${(action.data as any).newName}, Capacidad: ${(action.data as any).oldCapacity} → ${(action.data as any).newCapacity}, Uso: ${(action.data as any).oldUsage} → ${(action.data as any).newUsage}`;
      case "REMOVE_EDGE":
        return `Enlace eliminado: ${(action.data as any).name}`;
      case "ADD_CLIENT":
        return `Cliente agregado: ${(action.data as any).name} en nodo ${(action.data as any).nodeName}, Capacidad vendida: ${(action.data as any).soldCapacity}, Uso: ${(action.data as any).usage}`;
      case "EDIT_CLIENT":
        return `Cliente editado: ${(action.data as any).oldName} → ${(action.data as any).newName}, Capacidad vendida: ${(action.data as any).oldSoldCapacity} → ${(action.data as any).newSoldCapacity}, Uso: ${(action.data as any).oldUsage} → ${(action.data as any).newUsage}`;
      case "REMOVE_CLIENT":
        return `Cliente eliminado: ${(action.data as any).name}`;
      default:
        return "-";
    }
  }

  if (actions.length > 0) {
    autoTable(doc, {
      startY: y,
      head: [["ID", "Tipo", "Fecha/Hora", "Datos"]],
      body: actions.map((action) => [
        action.id.toString(),
        action.type,
        action.timestamp,
        formatActionData(action),
      ]),
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 11,
      },
      bodyStyles: {
        fontSize: 9,
        lineColor: [220, 220, 220],
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
      styles: { cellPadding: 2 },
      columnStyles: {
        3: { cellWidth: 60 },
      },
      theme: "grid",
    });
    y = (doc as any).lastAutoTable?.finalY
      ? (doc as any).lastAutoTable.finalY + 10
      : y + 40;
  } else {
    doc.setFontSize(11);
    doc.text("No hay cambios registrados.", 14, y + 8);
    y += 20;
  }

  // Footer: Page number
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth - 14,
      doc.internal.pageSize.getHeight() - 8,
      { align: "right" },
    );
    doc.setTextColor(0, 0, 0);
  }

  const fileDate = now.toISOString().slice(0, 10); // YYYY-MM-DD
  doc.save(`reporte_${fileDate}.pdf`);
}
