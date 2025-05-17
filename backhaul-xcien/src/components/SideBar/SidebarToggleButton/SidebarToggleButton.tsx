import React from "react";
import { Button, Tooltip } from "@heroui/react";

interface SidebarCloseButtonProps {
  onPress: () => void;
  left?: number;
  right?: number;
  icon: any;
  isDisabled: boolean;
}

const SidebarToggleButton = React.forwardRef<
  HTMLButtonElement,
  SidebarCloseButtonProps
>(({ onPress, left, right, icon, isDisabled }, ref) => {
  if (isDisabled) {
    return (
      <Tooltip
        content="Selecciona primero un nodo o enlace"
        showArrow={true}
        placement="left"
        size="lg"
        classNames={{
          content: "h-[50px]",
        }}
      >
        <Button
          isIconOnly
          onPress={() => {}}
          className="bg-transparent"
          disableRipple
          disableAnimation
          radius="none"
          style={{
            position: "absolute",
            top: 30,
            left: left,
            right: right,
            zIndex: 10,
            background: "#fff",
            height: "100px",
            boxShadow: "-4px 4px 10px 0px rgba(0,0,0,0.12)",
            borderRadius: "15px 0% 0% 15px",
          }}
          isDisabled={false}
          ref={ref as any}
        >
          {icon}
        </Button>
      </Tooltip>
    );
  } else {
    return (
      <Button
        isIconOnly
        onPress={onPress}
        className="bg-transparent"
        disableRipple
        disableAnimation
        radius="none"
        style={{
          position: "absolute",
          top: 30,
          left: left,
          right: right,
          zIndex: 10,
          background: "#fff",
          height: "100px",
          boxShadow: "-4px 4px 10px 0px rgba(0,0,0,0.12)",
          borderRadius: "15px 0% 0% 15px",
        }}
        isDisabled={isDisabled}
        ref={ref as any}
      >
        {icon}
      </Button>
    );
  }
});

export default SidebarToggleButton;
