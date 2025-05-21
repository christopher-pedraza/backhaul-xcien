import { Core, BoundingBox12 } from "cytoscape";

let lastY = 0;

export const getBottomLeftPosition = (cy: Core): { x: number; y: number } => {
  const margin = 80;
  const nodeHeight = 60;

  if (!cy) {
    lastY = lastY ? lastY - nodeHeight : window.innerHeight - margin;
    return { x: margin, y: lastY };
  }

  const container = cy.container();
  if (!container) return { x: margin, y: window.innerHeight - margin };

  const rect = container.getBoundingClientRect();
  const zoom = cy.zoom();
  const pan = cy.pan();

  const containerX = -pan.x / zoom;
  const containerY = -pan.y / zoom;

  // Coloca en esquina inferior izquierda con márgenes
  const x = containerX + margin;
  const y = containerY + rect.height / zoom - margin;

  return { x, y };
};


export function getRandomPosition(cy: Core): { x: number; y: number } {
  const RADIUS = 40;

  // graph bounding box
  const bb: BoundingBox12 | undefined = cy.nodes().boundingBox();

  // if no nodes, return a random position in the viewport
  if (!bb)
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    };

  // return a random position within the bounding box
  return {
    x: randomBetween(bb.x1 - RADIUS, bb.x2 + RADIUS),
    y: randomBetween(bb.y1 - RADIUS, bb.y2 + RADIUS),
  };
}

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}
