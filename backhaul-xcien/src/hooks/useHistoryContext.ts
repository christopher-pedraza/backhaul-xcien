import { useContext } from "react";
import { HistoryContext } from "@/context/HistoryContext";

export const useHistoryContext = () => {
  const ctx = useContext(HistoryContext);
  if (!ctx) {
    throw new Error("[useHistoryContext] Wrap your app in <HistoryProvider>");
  }
  return ctx;
};
