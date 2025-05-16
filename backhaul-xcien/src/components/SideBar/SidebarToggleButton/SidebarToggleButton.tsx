import { Button } from "@heroui/react";

interface SidebarCloseButtonProps {
  onPress: () => void;
  left?: number;
  right?: number;
  icon: any;
  isDisabled: boolean;
}

export default function SidebarToggleButton({
  onPress,
  left,
  right,
  icon,
  isDisabled,
}: SidebarCloseButtonProps) {
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
    >
      {icon}
    </Button>
  );
}
