import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { Button, Tabs, Tab, Tooltip } from "@heroui/react";

// Iconos
import ClipboardIcon from "@/components/Sidebar/Icons/ClipboardIcon";
import SettingsIcon from "@/components/Sidebar/Icons/SettingsIcon";
import NetworkIcon from "@/components/Sidebar/Icons/NetworkIcon";
import CloseDrawerIcon from "@/components/Sidebar/Icons/CloseDrawerIcon";
import OpenDrawerIcon from "@/components/Sidebar/Icons/OpenDrawerIcon";

// Components
import SidebarToggleButton from "./SidebarToggleButton/SidebarToggleButton";

// Tabs
import TabConfiguracion from "./TabConfiguracion/TabConfiguracion";
import TabResumen from "./TabConfiguracion/TabResumen";

interface SideBarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean | ((prevState: boolean) => boolean)) => void;
  selectedNode: any; // TODO: PONER EL TIPO CORRECTO
}

export default function Sidebar({
  isOpen,
  setIsOpen,
  selectedNode,
}: SideBarProps) {
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  if (isOpen) {
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
          <SidebarToggleButton
            onPress={toggleDrawer}
            left={-40}
            right={undefined}
            icon={
              <CloseDrawerIcon
                fill="currentColor"
                size={24}
                height={24}
                width={24}
              />
            }
            isDisabled={false}
          />
          <div className="relative flex flex-col h-full">
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
                  <TabConfiguracion
                    selectedNode={selectedNode}
                    isOpen={isOpen}
                  />
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
                >
                  <TabResumen
                    cambiosCapacidadV={[]}
                    cambiosCapacidadA={[1, 2]}
                    cambiosConsumoV={[1]}
                    cambiosConsumoA={[1]}
                  />
                </Tab>
              </Tabs>
            </div>
          </div>
        </Drawer>
      </>
    );
  } else if (selectedNode) {
    return (
      <SidebarToggleButton
        onPress={toggleDrawer}
        left={undefined}
        right={0}
        icon={
          <OpenDrawerIcon
            fill="currentColor"
            size={24}
            height={24}
            width={24}
          />
        }
        isDisabled={false}
      />
    );
  } else {
    return (
      <SidebarToggleButton
        onPress={toggleDrawer}
        left={undefined}
        right={0}
        icon={
          <OpenDrawerIcon
            fill="currentColor"
            size={24}
            height={24}
            width={24}
          />
        }
        isDisabled={true}
      />
    );
  }
}
