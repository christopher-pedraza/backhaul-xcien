import { Button, Tabs, Tab, Card, CardBody } from "@heroui/react";
import { useCyContext } from "@/hooks/useCyContext";

interface TabConfiguracionProps {
  selectedNode: string;
}

export default function TabConfiguracion({
  selectedNode,
}: TabConfiguracionProps) {
  const { cy } = useCyContext();
  if (!cy) return null;

  const node_data = cy.getElementById(selectedNode).data();

  return (
    <Card className="w-full">
      <CardBody>{node_data["usage"]}</CardBody>
    </Card>
  );
}
