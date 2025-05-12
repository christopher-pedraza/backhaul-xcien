import { FC } from "react";
import Graph from "@/components/graph";
import { useCyContext } from "@/hooks/useCyContext";
import { getRandomPosition } from "./utils";

interface Props { }

const IndexPage: FC<Props> = ({
}: Props) => {
  const { cy } = useCyContext();

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
      cy.add({ group: "edges", data: { id: `${newId}-${target.id()}`, source: newId, target: target.id() } });
    }

  };

  return (
    <div className="flex-1 flex flex-col">
      <button
        className="bg-blue-500 text-white p-2 rounded"
        onClick={addNode}
      >
        Add Node
      </button>
      <Graph />
    </div>
  );
}


export default IndexPage;