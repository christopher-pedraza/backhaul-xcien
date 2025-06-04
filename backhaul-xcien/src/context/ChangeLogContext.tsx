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
  // title: string;
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
export interface ChangeLogContextValue {
  actions: UserAction[];
  addAction: (action: Omit<UserAction, "timestamp" | "id">) => void;
  clearActions: () => void;
  switchTopology: (id: string) => void;
  currentTopologyId: string | null;
}

export const ChangeLogContext = createContext<
  ChangeLogContextValue | undefined
>(undefined);

export const ChangeLogProvider = ({ children }: { children: ReactNode }) => {
  const [actionsByTopology, setActionsByTopology] = useState<
    Record<string, UserAction[]>
  >({});
  const [currentTopologyId, setCurrentTopologyId] = useState<string | null>(
    null,
  );
  const actions = currentTopologyId
    ? actionsByTopology[currentTopologyId] || []
    : [];

  const addAction = (action: Omit<UserAction, "timestamp" | "id">) => {
    if (!currentTopologyId) return;
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

    const prevActions = actionsByTopology[currentTopologyId] || [];
    const newAction: UserAction = {
      ...action,
      id: prevActions.length + 1,
      timestamp: formattedTimestamp,
    };
    setActionsByTopology((prev) => ({
      ...prev,
      [currentTopologyId]: [...prevActions, newAction],
    }));
  };

  const clearActions = () => {
    if (!currentTopologyId) return;
    setActionsByTopology((prev) => ({
      ...prev,
      [currentTopologyId]: [],
    }));
  };

  const switchTopology = (id: string) => {
    setCurrentTopologyId(id);
    setActionsByTopology((prev) => ({
      ...prev,
      [id]: prev[id] || [],
    }));
  };

  return (
    <ChangeLogContext.Provider
      value={{
        actions,
        addAction,
        clearActions,
        switchTopology,
        currentTopologyId,
      }}
    >
      {children}
    </ChangeLogContext.Provider>
  );
};
