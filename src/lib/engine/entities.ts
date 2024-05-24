import ShortUniqueId from "short-unique-id";
import type { Icon } from "./icons";

const uid = new ShortUniqueId();

export interface Entity {
  id: string;
  name: string;
  icon: Icon;
}

export function entity<T extends Entity>(attrs: Partial<T> | string): T {
  let obj: Partial<T>;
  if (typeof attrs === "string") {
    obj = {};
    obj.name = attrs;
  } else {
    obj = { ...attrs };
  }
  if (obj.id === undefined) {
    obj.id = uid.rnd();
  }
  if (obj.name === undefined) {
    obj.name = `OBJ ID ${obj.name}`;
  }
  return obj as T;
}

export function find<T extends Entity>(list: T[], id: string): T | undefined {
  return list.find((e) => e.id === id);
}

export function remove<T extends Entity>(list: T[], id: string): boolean {
  const i = list.findIndex((e) => e.id === id);
  if (i > -1) {
    list.splice(i, 1);
    return true;
  }
  return false;
}
