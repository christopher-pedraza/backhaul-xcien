import {
  UserAction,
  UserActionType,
} from "../../../src/context/ChangeLogContext";

export const getActionType = (
  type: UserActionType,
): "error" | "info" | "success" => {
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
        "\n-------------------------------------------\n",
        ...(action.data as any).removedEdges.map(
          (edge: string) => `- Enlace eliminado: ${edge}`,
        ),
      ];

    case UserActionType.ADD_EDGE:
      return [
        `Desde: ${(action.data as any).source}`,
        `Hacia: ${(action.data as any).target}`,
        `Capacidad: ${(action.data as any).capacity}`,
        `Uso: ${(action.data as any).usage}`,
      ];

    case UserActionType.EDIT_EDGE:
    const { oldName, newName, oldCapacity, newCapacity } = action.data as any;

    const lines = [
        `Nombre anterior: ${oldName}`,
        `Nuevo nombre: ${newName}`,
    ];

    if (oldCapacity !== newCapacity) {
        lines.push(`Capacidad: ${oldCapacity} → ${newCapacity}`);
    }

    return lines;


    case UserActionType.REMOVE_EDGE:
      return [`Enlace: ${(action.data as any).name}`];

    case UserActionType.ADD_CLIENT:
      return [
        `Cliente: ${(action.data as any).name}`,
        `Localizado en: ${(action.data as any).nodeName}`,
        `Capacidad vendida: ${(action.data as any).soldCapacity}`,
        `Uso: ${(action.data as any).usage}`,
      ];

    case UserActionType.REMOVE_CLIENT:
      return [
        `Cliente: ${(action.data as any).name}`,
        `Localizado en: ${(action.data as any).nodeName}`,
      ];

    case UserActionType.EDIT_CLIENT: {
      const {
        oldName,
        newName,
        oldSoldCapacity,
        newSoldCapacity,
        oldUsage,
        newUsage,
        nodeName,
      } = action.data as any;

      const changes: string[] = [];

      if (oldName !== newName) {
        changes.push(`Nombre anterior: ${oldName}`);
        changes.push(`Nuevo nombre: ${newName}`);
      } else {
        changes.push(`Nombre: ${oldName}`);
      }

      changes.push(`Localizado en: ${nodeName}`);

      if (oldSoldCapacity !== newSoldCapacity) {
        changes.push(
          `Capacidad vendida: ${oldSoldCapacity} → ${newSoldCapacity}`,
        );
      }

      if (oldUsage !== newUsage) {
        changes.push(`Uso: ${oldUsage} → ${newUsage}`);
      }

      return changes;
    }

    default:
      return ["Sin detalles"];
  }
};
