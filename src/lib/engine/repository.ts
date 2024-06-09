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

export class EntityManager<T extends Entity> {
  constructor(protected R: Repository) {
    this.R[this.namespace] ??= {};
  }

  get namespace(): string {
    return this.constructor.name;
  }

  ref(obj: Partial<T>): string | undefined {
    // Overriden by derived classes if needed
    return;
  }

  id(obj: Partial<T>): EntityId {
    if ("id" in obj) {
      return new EntityId(obj["id"]);
    }
    const ref = this.ref(obj);
    if (ref) {
      return new EntityId({ namespace: this.namespace, ref });
    }
    return new EntityId({ namespace: this.namespace, ref: undefined });
  }

  create(obj: Partial<T>): T {
    const id = this.id(obj);
    id.namespace ||= this.namespace;
    id.ref ||= uid.rnd();
    obj.id = id.toString();
    return create<T>(this.R, obj.id, obj);
  }

  get(obj: Partial<T>): T | undefined {
    const id = this.id(obj);
    return get<T>(this.R, id.toString());
  }

  getOrCreate(obj: Partial<T>): T {
    const id = this.id(obj);
    return getOrCreate(this.R, id.toString(), obj);
  }

  query(pred?: Predicate<T>): T[] {
    return query<T>(this.R, this.namespace, pred);
  }

  remove(obj: Partial<T>): T | undefined {
    const id = this.id(obj);
    return remove<T>(this.R, id.toString());
  }

  removeAll(pred?: Predicate<T>): T[] {
    return removeAll<T>(this.R, this.namespace, pred);
  }

  related(obj: Partial<T>): any {
    return related<T>(this.R, obj);
  }
}

type Predicate<T> =
  | Partial<T>
  // | ((v: T, i: number, a: T[]) => boolean)
  | ArrayFilterFnParams;

export function create<T extends Entity>(
  R: Repository,
  partialId: string,
  obj: Partial<T>,
): T {
  let id = new EntityId(partialId);
  id.ref ||= uid.rnd();
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

type ArrayFilterFnParams = Parameters<typeof Array.prototype.filter>[0];

/**
 *
 * @param R Repository
 * @param namespace Namespace of the items
 * @param pred Either a set of attributes to match, or a function for Array.prototype.filter
 * @returns A list of items
 */
export function query<T extends Entity>(
  R: Repository,
  namespace: string,
  pred?: Predicate<T>,
): T[] {
  let objects: T[] = [];
  if (namespace in R) {
    objects = Object.values<T>(R[namespace]);
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
    } else if (typeof pred === "function") {
      filterFn = pred;
    }
    if (typeof filterFn !== "undefined") {
      return objects.filter(filterFn);
    }
  }
  return objects;
}

export function remove<T extends Entity>(
  R: Repository,
  id: string,
): T | undefined {
  let { namespace, ref } = new EntityId(id);
  if (namespace in R && ref in R[namespace]) {
    const obj = R[namespace][ref];
    delete R[namespace][ref];
    return obj;
  }
}

export function removeAll<T extends Entity>(
  R: Repository,
  namespace: string,
  pred?: Predicate<T>,
): T[] {
  const objs = query<T>(R, namespace, pred);
  for (const obj of objs) {
    let { namespace, ref } = new EntityId(obj.id);
    delete R[namespace][ref];
  }
  return objs;
}

export function related<T extends Entity>(R: Repository, obj: Partial<T>): any {
  return Object.entries(obj).reduce((rel, [key, value]) => {
    if (key.endsWith("Id") && value.indexOf(ID_SEPARATOR) >= 0) {
      rel[key] = get(this.R, value);
    }
    return [key, rel[key]];
  }, {});
}
