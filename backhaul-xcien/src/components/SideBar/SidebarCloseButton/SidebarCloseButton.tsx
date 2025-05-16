import { Button } from "@heroui/react";
import CloseDrawerIcon from "@/components/Sidebar/Icons/CloseDrawerIcon";

interface SidebarCloseButtonProps {
  onPress: () => void;
}

export default function SidebarCloseButton({
  onPress,
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
        left: -40,
        zIndex: 10,
        background: "#fff",
        height: "100px",
        boxShadow: "-4px 4px 10px 0px rgba(0,0,0,0.12)",
        borderRadius: "15px 0% 0% 15px",
      }}
    >
      <CloseDrawerIcon fill="currentColor" size={24} height={24} width={24} />
    </Button>
  );
}
