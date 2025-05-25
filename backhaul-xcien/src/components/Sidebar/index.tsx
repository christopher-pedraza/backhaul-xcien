import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { Tabs, Tab } from "@heroui/react";

// Iconos
import SettingsIcon from "./Icons/SettingsIcon";
// import NetworkIcon from "./Icons/NetworkIcon";
import CloseDrawerIcon from "./Icons/CloseDrawerIcon";
import OpenDrawerIcon from "./Icons/OpenDrawerIcon";
import HistoryIcon from "./Icons/HistoryIcon";
import { AlertTriangleIcon } from "lucide-react";

// Components
import SidebarToggleButton from "./SidebarToggleButton";

// Tabs
import TabConfiguracion from "./TabConfiguracion";
import TabAlertas from "./TabAlertas";
import TabResumen from "./TabResumen";

// Hooks
import { useEffect, useState } from "react";
import { useAlerts } from "@/context/AlertContext";

interface SideBarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean | ((prevState: boolean) => boolean)) => void;
  selectedNode: string;
  selectedType: string;
  wasTapped: boolean;
  setWasTapped: (value: boolean) => void;
  setSelectedNode: (value: string) => void;
  setSelectedType: (value: string) => void;
}

export default function Sidebar({
  isOpen,
  setIsOpen,
  selectedNode,
  selectedType,
  wasTapped,
  setWasTapped,
  setSelectedNode,
  setSelectedType,
}: SideBarProps) {
  useEffect(() => {
    if (wasTapped) {
      if (!isOpen) handleOpenButton();
      setSelected("configuracion");
      setWasTapped(false);
    }
  }, [wasTapped]);

  const { alertCards } = useAlerts();

  useEffect(() => {
    setSelected("alertas");
  }, [alertCards]);

  const [openButtonRotation, setOpenButtonRotation] = useState(0);
  const [showOpenButton, setShowOpenButton] = useState(true);
  const [disableOpenButton, setDisableOpenButton] = useState(false);

  const [selected, setSelected] = useState("alertas");

  // Animate open button rotation before opening drawer
  const handleOpenButton = () => {
    setDisableOpenButton(true);
    setOpenButtonRotation(180);
    setTimeout(() => {
      setIsOpen((prev) => !prev);
      setShowOpenButton(false); // Hide button while drawer is open
      setDisableOpenButton(false);
    }, 300); // match icon transition duration
  };

  // After drawer closes, rotate open button back and show it
  const handleDrawerClose = () => {
    setDisableOpenButton(true);
    setIsOpen((prev) => !prev);
    setTimeout(() => {
      setOpenButtonRotation(0);
      setShowOpenButton(true);
      setDisableOpenButton(false);
    }, 500); // match drawer close duration
  };

  return (
    <>
      <Drawer
        open={isOpen}
        onClose={handleDrawerClose}
        direction="right"
        size={"450px"}
        duration={500}
        enableOverlay={false}
        style={{
          borderRadius: "15px 0px 0px 15px",
        }}
        zIndex={100}
      >
        <SidebarToggleButton
          onPress={handleDrawerClose}
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
              selectedKey={selected}
              onSelectionChange={(key) => setSelected(String(key))}
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
                    <AlertTriangleIcon />
                    <span>Alertas</span>
                  </div>
                }
              >
                <TabAlertas
                  setSelectedNode={setSelectedNode}
                  setSelectedType={setSelectedType}
                />
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
                <TabResumen />
              </Tab>
            </Tabs>
          </div>
        </div>
      </Drawer>
      <SidebarToggleButton
        onPress={handleOpenButton}
        left={undefined}
        right={0}
        icon={
          <OpenDrawerIcon
            fill="currentColor"
            size={24}
            height={24}
            width={24}
            rotate={openButtonRotation}
          />
        }
        isDisabled={disableOpenButton}
        isVisible={showOpenButton}
      />
    </>
  );
}
