import { createContext, useState, ReactNode } from "react";

export enum UserActionType {
  ADD_NODE = "ADD_NODE",
  REMOVE_NODE = "REMOVE_NODE",
  EDIT_NODE = "EDIT_NODE",
  ADD_EDGE = "ADD_EDGE",
  REMOVE_EDGE = "REMOVE_EDGE",
  EDIT_EDGE = "EDIT_EDGE",
  ADD_CLIENT = "ADD_CLIENT",
  REMOVE_CLIENT = "REMOVE_CLIENT",
  EDIT_CLIENT = "EDIT_CLIENT",
}

interface AddNodeActionData {
  name: string;
}

interface EditNodeActionData {
  oldName: string;
  newName: string;
  oldCapacity: string;
  newCapacity: string;
  oldUsage: string;
  newUsage: string;
}

interface RemoveNodeActionData {
  name: string;
  removedEdges: string[];
}

interface AddEdgeActionData {
  source: string;
  target: string;
  capacity: string;
  usage: string;
}

interface RemoveEdgeActionData {
  name: string;
}

interface EditEdgeActionData {
  oldName: string;
  newName: string;
  oldCapacity: string;
  newCapacity: string;
  oldUsage: string;
  newUsage: string;
}

interface AddClientActionData {
  name: string;
  nodeName: string;
  soldCapacity: string;
  usage: string;
}

interface RemoveClientActionData {
  name: string;
}

interface EditClientActionData {
  oldName: string;
  newName: string;
  oldSoldCapacity: string;
  newSoldCapacity: string;
  oldUsage: string;
  newUsage: string;
}

// Interface for a user action
export interface UserAction {
  id: number;
  title: string;
  type: UserActionType;
  timestamp: string;
  data:
    | AddNodeActionData
    | EditNodeActionData
    | RemoveNodeActionData
    | AddEdgeActionData
    | RemoveEdgeActionData
    | EditEdgeActionData
    | AddClientActionData
    | RemoveClientActionData
    | EditClientActionData;
}

// Interface for the context value
export interface HistoryContextValue {
  actions: UserAction[];
  addAction: (action: Omit<UserAction, "timestamp">) => void;
}

export const HistoryContext = createContext<HistoryContextValue | undefined>(
  undefined,
);

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [actions, setActions] = useState<UserAction[]>([]);

  const addAction = (action: Omit<UserAction, "timestamp">) => {
    const now = new Date();
    const formattedTimestamp = `${now
      .toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(
        /^(\d{2}):(\d{2}):(\d{2})$/,
        "$1:$2:$3",
      )} - ${now.getDate().toString().padStart(2, "0")} de ${now.toLocaleString("es-ES", { month: "long" })}, ${now.getFullYear()}`;

    const newAction: UserAction = {
      ...action,
      id: actions.length + 1,
      timestamp: formattedTimestamp,
    };
    setActions((prevActions) => [...prevActions, newAction]);
  };

  return (
    <HistoryContext.Provider value={{ actions, addAction }}>
      {children}
    </HistoryContext.Provider>
  );
};
