import React from "react";
import { Button } from "@heroui/react";

interface SidebarCloseButtonProps {
  onPress: () => void;
  left?: number;
  right?: number;
  icon: any;
  isDisabled: boolean;
  isVisible?: boolean; // Add isVisible prop for animation
}

const SidebarToggleButton = React.forwardRef<
  HTMLButtonElement,
  SidebarCloseButtonProps
>(({ onPress, left, right, icon, isDisabled, isVisible = true }, ref) => {
  return (
    <Button
      isIconOnly
      onPress={onPress}
      className={`bg-transparent transition-all duration-300 ease-in-out ${
        isVisible
          ? "opacity-100 translate-x-0 pointer-events-auto"
          : "opacity-0 translate-x-4 pointer-events-none"
      }`}
      disableRipple
      disableAnimation
      radius="none"
      style={{
        position: "absolute",
        top: 70,
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
});

export default SidebarToggleButton;
