import { ReactNode } from "react";
import { ChangeLogProvider as InnerChangeLogProvider } from "@/context/ChangeLogContext";

export const ChangeLogProvider = ({ children }: { children: ReactNode }) => {
  return <InnerChangeLogProvider>{children}</InnerChangeLogProvider>;
};
