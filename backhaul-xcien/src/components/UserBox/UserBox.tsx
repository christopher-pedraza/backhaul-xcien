import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import "./UserBox.css";

type UserBox = {
  nombreCompleto: string;
};

export default function App({ nombreCompleto }: UserBox) {
  const getNombreFormateado = (nombre: string) => {
    const partes = nombre.trim().split(" ");
    if (partes.length < 2) return partes[0];
    return `${partes[0]} ${partes[1][0]}.`;
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button className="button_userbox hover:bg-transparent" >
          {getNombreFormateado(nombreCompleto)}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        <DropdownItem key="new">Cerrar sesión</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );

}
