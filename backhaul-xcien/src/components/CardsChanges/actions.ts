import { UserAction, UserActionType } from "../../../src/context/ChangeLogContext";

export const getActionType = (type: UserActionType): "error" | "info" | "success" => {
  switch (type) {
    case UserActionType.REMOVE_NODE:
    case UserActionType.REMOVE_EDGE:
    case UserActionType.REMOVE_CLIENT:
      return "error";
    case UserActionType.ADD_NODE:
    case UserActionType.ADD_EDGE:
    case UserActionType.ADD_CLIENT:
      return "success";
    default:
      return "info";
  }
};

export const getActionTitle = (action: UserAction): string => {
  switch (action.type) {
    case UserActionType.ADD_NODE:
      return "Nodo creado";
    case UserActionType.REMOVE_NODE:
      return "Nodo eliminado";
    case UserActionType.EDIT_NODE:
      return "Nodo editado";
    case UserActionType.ADD_EDGE:
      return "Enlace agregado";
    case UserActionType.REMOVE_EDGE:
      return "Enlace eliminado";
    case UserActionType.EDIT_EDGE:
      return "Enlace editado";
    case UserActionType.ADD_CLIENT:
      return "Cliente agregado";
    case UserActionType.REMOVE_CLIENT:
      return "Cliente eliminado";
    case UserActionType.EDIT_CLIENT:
      return "Cliente editado";
    default:
      return "Cambio";
  }
};

export const getActionDetails = (action: UserAction): string[] => {
  switch (action.type) {
    case UserActionType.ADD_NODE:
      return [`Nombre: ${(action.data as any).name}`];

    case UserActionType.EDIT_NODE:
      return [
        `Nombre anterior: ${(action.data as any).oldName}`,
        `Nuevo nombre: ${(action.data as any).newName}`,
      ];

    case UserActionType.REMOVE_NODE:
      return [
        `Nodo: ${(action.data as any).name}`,
        ...(action.data as any).removedEdges.map((edge: string) => `Enlace eliminado: ${edge}`),
      ];

    case UserActionType.ADD_EDGE:
      return [
        `Desde: ${(action.data as any).source}`,
        `Hacia: ${(action.data as any).target}`,
        `Capacidad: ${(action.data as any).capacity}`,
        `Uso: ${(action.data as any).usage}`,
      ];

    case UserActionType.EDIT_EDGE:
      return [
        `Nombre anterior: ${(action.data as any).oldName}`,
        `Nuevo nombre: ${(action.data as any).newName}`,
        `Capacidad: ${(action.data as any).oldCapacity} → ${(action.data as any).newCapacity}`,
        `Uso: ${(action.data as any).oldUsage} → ${(action.data as any).newUsage}`,
      ];

    case UserActionType.REMOVE_EDGE:
      return [`Enlace: ${(action.data as any).name}`];

    case UserActionType.ADD_CLIENT:
      return [
        `Cliente: ${(action.data as any).name}`,
        `Nodo: ${(action.data as any).nodeName}`,
        `Capacidad vendida: ${(action.data as any).soldCapacity}`,
        `Uso: ${(action.data as any).usage}`,
      ];

    case UserActionType.REMOVE_CLIENT:
      return [`Cliente: ${(action.data as any).name}`];

    case UserActionType.EDIT_CLIENT:
      return [
        `Nombre anterior: ${(action.data as any).oldName}`,
        `Nuevo nombre: ${(action.data as any).newName}`,
        `Capacidad vendida: ${(action.data as any).oldSoldCapacity} → ${(action.data as any).newSoldCapacity}`,
        `Uso: ${(action.data as any).oldUsage} → ${(action.data as any).newUsage}`,
      ];

    default:
      return ["Sin detalles"];
  }
};
