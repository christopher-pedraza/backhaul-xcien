import { Core, BoundingBox12 } from "cytoscape";


export function getRandomPosition(cy: Core): { x: number; y: number } {
  const RADIUS = 40;   

  // graph bounding box
  const bb: BoundingBox12 | undefined = cy.nodes().boundingBox(); 

  // if no nodes, return a random position in the viewport
  if (!bb) return { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight };

  // return a random position within the bounding box
  return {
    x: randomBetween(bb.x1 - RADIUS, bb.x2 + RADIUS),
    y: randomBetween(bb.y1 - RADIUS, bb.y2 + RADIUS),
  };
}

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}