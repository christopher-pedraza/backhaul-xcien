import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem } from "@heroui/react";
import "./NavBar.css";



const MyNavbar = () => {
  return (
    <Navbar className="navbar">
      <NavbarBrand className="navbar-logo">
        <a href="/">FlowForge</a>
      </NavbarBrand>

      <NavbarContent>
        <NavbarItem>
          <a href="#contacto" className="hover:underline">Cuenta</a>
        </NavbarItem>
      </NavbarContent>


      <NavbarMenu>
        <NavbarMenuItem>
          <a href="#inicio">Cuenta</a>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default MyNavbar;
