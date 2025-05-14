import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { Button, Tabs, Tab, Card, CardBody } from "@heroui/react";

// Iconos
import CloseDrawerIcon from "@/components/Icons/CloseDrawerIcon";
import ClipboardIcon from "@/components/Icons/ClipboardIcon";
import SettingsIcon from "@/components/Icons/SettingsIcon";
import NetworkIcon from "@/components/Icons/NetworkIcon";

interface SideBarProps {
    isOpen: boolean;
    setIsOpen: (value: boolean | ((prevState: boolean) => boolean)) => void;
    cy: any; // TODO: PONER EL TIPO CORRECTO
    selectedNode: any; // TODO: PONER EL TIPO CORRECTO
}

export default function SideBar({
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
                size={"20vw"}
                duration={200}
                enableOverlay={false}
                style={{
                    borderRadius: "15px 0px 0px 15px",
                }}
            >
                <div style={{ position: "relative", height: "100%" }}>
                    <Button
                        isIconOnly
                        onPress={toggleDrawer}
                        className="bg-transparent"
                    >
                        <CloseDrawerIcon
                            fill="currentColor"
                            size={24}
                            height={24}
                            width={24}
                        />
                    </Button>
                    <div className="flex flex-col items-center h-full">
                        <Tabs
                            aria-label="Options"
                            color="primary"
                            variant="bordered"
                            size="lg"
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
                                    <Card className="w-full">
                                        <CardBody>{selectedNode}</CardBody>
                                    </Card>
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
