import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { AlertCardData } from "../context/AlertContext";
import { UserAction } from "../context/ChangeLogContext";

export function generatePDFReport(
  alertCards: AlertCardData[],
  actions: UserAction[]
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

  // --- Types ---
  type CardField = { label: string; value: string };

  // --- Action Card Helpers ---
  function getActionCardFields(
    action: UserAction
  ): [string, string, string, string] {
    switch (action.type) {
      case "ADD_NODE":
        return [(action.data as any).name || "-", "-", "-", "Nodo agregado"];
      case "EDIT_NODE":
        return [
          (action.data as any).oldName || "-",
          `Nombre: ${(action.data as any).oldName}` || "-",
          `Nombre: ${(action.data as any).newName}` || "-",
          "Nodo editado",
        ];
      case "REMOVE_NODE":
        return [
          (action.data as any).name || "-",
          "-",
          "-",
          (action.data as any).removedEdges?.length
            ? `Enlaces eliminados: ${(action.data as any).removedEdges.join(", ")}`
            : "Nodo eliminado",
        ];
      case "ADD_EDGE":
        return [
          `${(action.data as any).source} - ${(action.data as any).target}`,
          "-",
          `-`,
          `Capacidad: ${(action.data as any).capacity}`,
        ];
      case "EDIT_EDGE":
        return [
          `${(action.data as any).oldName}`,
          `Capacidad: ${(action.data as any).oldCapacity}`,
          `Capacidad: ${(action.data as any).newCapacity}`,
          `Características del enlace editadas`,
        ];
      case "REMOVE_EDGE":
        return [
          (action.data as any).name || "-",
          (action.data as any).name || "-",
          "-",
          "Enlace eliminado",
        ];
      case "ADD_CLIENT":
        return [
          (action.data as any).name || "-",
          "-",
          "-",
          `Nodo: ${(action.data as any).nodeName}\nCapacidad vendida: ${(action.data as any).soldCapacity}\nUso: ${(action.data as any).usage}`,
        ];
      case "EDIT_CLIENT":
        return [
          (action.data as any).oldName || "-",
          `Nombre: ${(action.data as any).oldName}\nCapacidad vendida: ${(action.data as any).oldSoldCapacity}\nUso: ${(action.data as any).oldUsage}`,
          `Nombre: ${(action.data as any).newName}\nCapacidad vendida: ${(action.data as any).newSoldCapacity}\nUso: ${(action.data as any).newUsage}`,
          "Características del cliente editadas",
        ];
      case "REMOVE_CLIENT":
        return [
          (action.data as any).name || "-",
          "-",
          "-",
          "Cliente eliminado",
        ];
      default:
        return ["-", "-", "-", "-"];
    }
  }

  function drawActionCard(
    doc: jsPDF,
    action: UserAction,
    y: number,
    cardWidth: number,
    options: {
      cardPadding: number;
      labelWidth: number;
      headerHeight: number;
      footerHeight: number;
      valueWidth: number;
    }
  ): number {
    const { cardPadding, labelWidth, headerHeight, footerHeight, valueWidth } =
      options;
    const [elemento, antes, despues, detalles] = getActionCardFields(action);
    const contentFields: CardField[] = [
      { label: "Elemento", value: elemento },
      { label: "Antes", value: antes },
      { label: "Después", value: despues },
      { label: "Detalles", value: detalles },
    ].filter((f) => f.value && f.value !== "-");
    const linesArr = contentFields.map((f) =>
      doc.splitTextToSize(f.value, valueWidth)
    );
    const lineHeight = 5.5;
    const contentHeight =
      linesArr.reduce((sum, lines) => sum + lines.length * lineHeight, 0) +
      contentFields.length * 2;
    const cardHeight = headerHeight + contentHeight + footerHeight;
    // Draw card background (all corners rounded)
    doc.setFillColor(245, 248, 255);
    doc.setDrawColor(180);
    doc.roundedRect(14, y, cardWidth, cardHeight, 3, 3, "FD");
    // Draw header (only top corners rounded, bottom corners straight)
    doc.setFillColor(41, 128, 185);
    doc.setDrawColor(41, 128, 185);
    doc.roundedRect(14, y, cardWidth, headerHeight, 3, 3, "F");
    doc.rect(14, y + headerHeight - 3, cardWidth, 3, "F");
    // Header text: ID left, Type right
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(`${action.id}`, 18, y + 8);
    doc.setFontSize(10);
    doc.text(`${action.type}`, 14 + cardWidth - 6, y + 8, { align: "right" });
    doc.setTextColor(0, 0, 0);
    // Draw content fields
    let lineY = y + headerHeight + cardPadding + lineHeight - 2;
    contentFields.forEach((f, idx) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${f.label}:`, 16, lineY);
      doc.setFont("helvetica", "normal");
      (linesArr[idx] as string[]).forEach((line: string, lidx: number) => {
        doc.text(line, 16 + labelWidth, lineY);
        if (lidx < (linesArr[idx] as string[]).length - 1) lineY += lineHeight;
      });
      lineY += lineHeight;
    });
    // Draw footer (Fecha/Hora)
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(
      action.timestamp,
      14 + cardWidth - cardPadding,
      y + cardHeight - cardPadding,
      { align: "right" }
    );
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    return cardHeight;
  }

  if (actions.length > 0) {
    const cardMargin = 4;
    const cardPadding = 3;
    const cardWidth = pageWidth - 2 * 14;
    const labelWidth = 36;
    const valueWidth = cardWidth - labelWidth - 2 * cardPadding;
    const headerHeight = 12;
    const footerHeight = 8;
    doc.setFontSize(10);
    actions.forEach((action) => {
      // --- PAGE BREAK CHECK BEFORE DRAWING CARD ---
      const [elemento, antes, despues, detalles] = getActionCardFields(action);
      const contentFields = [
        { label: "Elemento", value: elemento },
        { label: "Antes", value: antes },
        { label: "Después", value: despues },
        { label: "Detalles", value: detalles },
      ].filter((f) => f.value && f.value !== "-");
      const linesArr = contentFields.map((f) =>
        doc.splitTextToSize(f.value, valueWidth)
      );
      const lineHeight = 5.5;
      const contentHeight =
        linesArr.reduce((sum, lines) => sum + lines.length * lineHeight, 0) +
        contentFields.length * 2;
      const cardHeight = headerHeight + contentHeight + footerHeight;
      const minTopMargin = 20;
      if (y + cardHeight > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        y = minTopMargin;
      }
      // --- DRAW CARD ---
      const drawnHeight = drawActionCard(doc, action, y, cardWidth, {
        cardPadding,
        labelWidth,
        headerHeight,
        footerHeight,
        valueWidth,
      });
      y += drawnHeight + cardMargin;
    });
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
      { align: "right" }
    );
    doc.setTextColor(0, 0, 0);
  }

  const fileDate = now.toISOString().slice(0, 10); // YYYY-MM-DD
  doc.save(`reporte_${fileDate}.pdf`);
}
