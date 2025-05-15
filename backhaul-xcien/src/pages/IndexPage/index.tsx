import { FC, useState } from "react";
import Graph from "@/components/graph";
import { useCyContext } from "@/hooks/useCyContext";
import { getRandomPosition } from "./utils";
import SideBar from "@/components/SideBar/Sidebar";

interface Props {}

const IndexPage: FC<Props> = ({}: Props) => {
  const { cy } = useCyContext();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);

  if (cy) {
    cy.on("tap", "node", (event) => {
      const target = event.target;
      const id = target.id();
      console.log("Node ID:", id);
      setSelectedNode(id);
      if (!isOpen) {
        setIsOpen(true);
      }
    });
    cy.on("tap", "edge", (event) => {
      const target = event.target;
      const id = target.id();
      console.log("Node ID:", id);
      setSelectedNode(id);
      if (!isOpen) {
        setIsOpen(true);
      }
    });
  }

  const addNode = () => {
    if (!cy) return;

    // generate a new id for the node
    const newId = `n${cy.nodes().size() + 1}`;

    // calculate a new position for the node
    const pos = getRandomPosition(cy);

    cy.add({ group: "nodes", data: { id: newId }, position: pos });

    // add an edge to a random existing node
    if (cy.nodes().size() > 1) {
      const target = cy.nodes()[Math.floor(Math.random() * cy.nodes().size())];
      cy.add({
        group: "edges",
        data: {
          id: `${newId}-${target.id()}`,
          source: newId,
          target: target.id(),
        },
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <button className="bg-blue-500 text-white p-2 rounded" onClick={addNode}>
        Add Node
      </button>
      <Graph />
      <SideBar
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        cy={cy}
        selectedNode={selectedNode}
      />
    </div>
  );
};

export default IndexPage;
