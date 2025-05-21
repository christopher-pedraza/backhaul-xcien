import { useState } from "react";
import { Navbar, NavbarBrand } from "@heroui/react";
import "./NavBar.css";
import UserBox from "../UserBox/UserBox";
import { ChevronUp, ChevronDown } from "lucide-react";

const MyNavbar = () => {
  const [visible, setVisible] = useState(true);
  const toggleNavbar = () => {
    setVisible(!visible);
  };

  return (
    <>
      <div className={`navbar-wrapper ${visible ? "visible" : "hidden"}`}>
        <Navbar className="navbar">
          <div className="navbar-section left" />

          <NavbarBrand className="navbar-logo">
            <a href="/">FlowForge</a>
          </NavbarBrand>

          <div className="navbar-section right">
            <UserBox nombreCompleto="Gerardo Mesa" />
          </div>

          {/* Botón dentro de la navbar */}
          <div className="open-close-button-div" onClick={toggleNavbar}>
            <div className="tag-navbar-open-close">
              {visible ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>
          </div>
        </Navbar>
      </div>

      {!visible && (
        <div className="open-close-button-div2" onClick={toggleNavbar}>
          <div className="tag-navbar-open-close">
            <ChevronDown size={15} />
          </div>
        </div>
      )}
    </>
  );
};

export default MyNavbar;