import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { Tabs, Tab } from "@heroui/react";

// Iconos
import ClipboardIcon from "./Icons/ClipboardIcon";
import SettingsIcon from "./Icons/SettingsIcon";
import NetworkIcon from "./Icons/NetworkIcon";
import CloseDrawerIcon from "./Icons/CloseDrawerIcon";
import OpenDrawerIcon from "./Icons/OpenDrawerIcon";
import HistoryIcon from "./Icons/HistoryIcon";

// Components
import SidebarToggleButton from "./SidebarToggleButton";

// Tabs
import TabConfiguracion from "./TabConfiguracion";
import TabAlertas from "./TabAlertas";
import TabResumen from "./TabResumen";

// Contexts
import { useChangeLogContext } from "@/hooks/useChangeLogContext";

import { useEffect } from "react";

interface SideBarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean | ((prevState: boolean) => boolean)) => void;
  selectedNode: string;
  selectedType: string;
}

export default function Sidebar({
  isOpen,
  setIsOpen,
  selectedNode,
  selectedType,
}: SideBarProps) {
  const { actions } = useChangeLogContext();
  useEffect(() => {
    console.log("actions", actions);
  }, [actions]);

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
          <div className="relative flex flex-col">
            <div className="flex flex-col items-center h-full">
              <Tabs
                aria-label="Options"
                color="primary"
                variant="bordered"
                placement="top"
                classNames={{
                  base: "pt-8",
                  tab: "h-10",
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
                  isDisabled={selectedNode == ""}
                >
                  <TabConfiguracion
                    selectedNode={selectedNode}
                    selectedType={selectedType}
                  />
                </Tab>
                <Tab
                  key="alertas"
                  title={
                    <div className="flex items-center space-x-2">
                      <NetworkIcon />
                      <span>Alertas</span>
                    </div>
                  }
                >
                  <TabAlertas />
                </Tab>
                <Tab
                  key="resumen"
                  title={
                    <div className="flex items-center space-x-2">
                      <HistoryIcon />
                      <span>Cambios</span>
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
        isDisabled={false}
      />
    );
  }
}
