import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { Button, Tabs, Tab, Card, CardBody } from "@heroui/react";

// Iconos
import ClipboardIcon from "@/components/Sidebar/Icons/ClipboardIcon";
import SettingsIcon from "@/components/Sidebar/Icons/SettingsIcon";
import NetworkIcon from "@/components/Sidebar/Icons/NetworkIcon";

// Components
import SidebarCloseButton from "./SidebarCloseButton/SidebarCloseButton";
import TabConfiguracion from "./TabConfiguracion/TabConfiguracion";

interface SideBarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean | ((prevState: boolean) => boolean)) => void;
  cy: any; // TODO: PONER EL TIPO CORRECTO
  selectedNode: any; // TODO: PONER EL TIPO CORRECTO
}

export default function Sidebar({
  isOpen,
  setIsOpen,
  cy,
  selectedNode,
}: SideBarProps) {
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <>
      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction="right"
        size={"450px"}
        duration={200}
        enableOverlay={false}
        style={{
          borderRadius: "15px 0px 0px 15px",
        }}
        zIndex={100}
      >
        <SidebarCloseButton onPress={toggleDrawer} />
        <div style={{ position: "relative", height: "100%" }}>
          <div className="flex flex-col items-center h-full">
            <Tabs
              aria-label="Options"
              color="primary"
              variant="bordered"
              placement="top"
              classNames={{
                base: "pt-8",
                tab: "h-14",
              }}
            >
              <Tab
                key="configuracion"
                title={
                  <div className="flex items-center space-x-2">
                    <SettingsIcon />
                    <span>Configuracion</span>
                  </div>
                }
              >
                <div className="flex flex-col items-center p-4 h-full">
                  <TabConfiguracion
                    selectedNode={selectedNode}
                    isOpen={isOpen}
                  />
                </div>
              </Tab>
              <Tab
                key="soluciones"
                title={
                  <div className="flex items-center space-x-2">
                    <NetworkIcon />
                    <span>Soluciones</span>
                  </div>
                }
              />
              <Tab
                key="resumen"
                title={
                  <div className="flex items-center space-x-2">
                    <ClipboardIcon />
                    <span>Resumen</span>
                  </div>
                }
              />
            </Tabs>
          </div>
        </div>
      </Drawer>
    </>
  );
}
