import React, { createContext, useContext, useState, ReactNode } from "react";

// Enum for action types (standardized by index)
export enum UserActionType {
  CREATE = 0,
  UPDATE = 1,
  DELETE = 2,
  // Add more as needed
}

// Interface for a user action
export interface UserAction {
  type: UserActionType;
  timestamp: number; // Unix timestamp (ms)
  // Optionally, add more fields (e.g., payload, description)
}

// Interface for the context value
export interface HistoryContextValue {
  actions: UserAction[];
  addAction: (action: Omit<UserAction, "timestamp">) => void;
}

export const HistoryContext = createContext<HistoryContextValue | undefined>(
  undefined
);

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [actions, setActions] = useState<UserAction[]>([]);

  const addAction = (action: Omit<UserAction, "timestamp">) => {
    setActions((prev) => [...prev, { ...action, timestamp: Date.now() }]);
  };

  return (
    <HistoryContext.Provider value={{ actions, addAction }}>
      {children}
    </HistoryContext.Provider>
  );
};
