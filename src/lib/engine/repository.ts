import equal from "fast-deep-equal";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId();
export const ID_SEPARATOR = "#";

export type Repository = {
  [key: string]: any;
};

export interface Entity {
  id: string;
}

export interface LongFormId {
  namespace: string;
  ref: string;
}

export class EntityId implements LongFormId {
  public namespace: string;
  public ref: string;

  constructor(id: string | LongFormId) {
    if (typeof id === "object") {
      this.namespace = id?.namespace;
      this.ref = id?.ref;
    } else {
      [this.namespace, this.ref] = id.split(ID_SEPARATOR);
    }
  }

  toString() {
    return `${this.namespace}${ID_SEPARATOR}${this.ref}`;
  }
}

export function create<T extends Entity>(
  R: Repository,
  partialId: string,
  obj: Partial<T>,
): T {
  let id = new EntityId(partialId);
  id.ref ??= uid.rnd();
  obj.id = id.toString();
  R[id.namespace] ??= {};
  R[id.namespace][id.ref] = obj;
  return obj as T;
}

export function get<T extends Entity>(
  R: Repository,
  id: string,
): T | undefined {
  let { namespace, ref } = new EntityId(id);
  if (namespace in R) {
    return R[namespace][ref];
  }
}

export function getOrCreate<T extends Entity>(
  R: Repository,
  id: string,
  newObj: Partial<T>,
): T | undefined {
  let obj = get<T>(R, id);
  if (typeof obj === "undefined") {
    obj = create<T>(R, id, newObj);
  }
  return obj;
}

export function getAll<T extends Entity>(
  R: Repository,
  namespace: string,
): T[] | undefined {
  if (namespace in R) {
    return Object.values<T>(R[namespace]);
  }
}

type ArrayFilterFnParams = Parameters<typeof Array.prototype.filter>[0];

/**
 *
 * @param R Repository
 * @param namespace Namespace of the items
 * @param pred Either a set of attributes to match, or a function for Array.prototype.filter
 * @returns A list of items
 */
export function filter<T extends Entity>(
  R: Repository,
  namespace: string,
  pred:
    | Partial<T>
    // | ((v: T, i: number, a: T[]) => boolean)
    | ArrayFilterFnParams,
): T[] | undefined {
  let filterFn: ArrayFilterFnParams;
  if (typeof pred === "object") {
    filterFn = (entity) => {
      for (const key in pred) {
        if (!equal(entity[key], pred[key])) {
          return false;
        }
      }
      return true;
    };
  } else {
    filterFn = pred;
  }
  return getAll<T>(R, namespace).filter(filterFn);
}

export function remove<T extends Entity>(R: Repository, id: string): boolean {
  let { namespace, ref } = new EntityId(id);
  if (namespace in R && ref in R[namespace]) {
    console.log("DELETE", id);
    delete R[namespace][ref];
    return true;
  }
  return false;
}
