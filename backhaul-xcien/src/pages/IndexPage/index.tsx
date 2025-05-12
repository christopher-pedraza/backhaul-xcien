import { FC } from "react";
import Graph from "@/components/graph";

interface Props { }

const IndexPage: FC<Props> = ({
}: Props) => {

  return (
    <div className="flex-1 flex flex-col">
      <Graph />
    </div>
  );
}


export default IndexPage;