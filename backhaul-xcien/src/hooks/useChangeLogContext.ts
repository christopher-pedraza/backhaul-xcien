import { useContext } from "react";
import { ChangeLogContext } from "@/context/ChangeLogContext";

export const useChangeLogContext = () => {
  const ctx = useContext(ChangeLogContext);
  if (!ctx) {
    throw new Error(
      "[useChangeLogContext] Wrap your app in <ChangeLogProvider>"
    );
  }
  return ctx;
};
