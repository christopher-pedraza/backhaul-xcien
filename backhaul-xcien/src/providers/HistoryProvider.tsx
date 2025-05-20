import React, { ReactNode } from "react";
import { HistoryProvider as InnerHistoryProvider } from "@/context/HistoryContext";

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  return <InnerHistoryProvider>{children}</InnerHistoryProvider>;
};
