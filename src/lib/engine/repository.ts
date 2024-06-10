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

  constructor(id?: string | LongFormId) {
    if (typeof id !== "undefined") {
      if (typeof id === "object") {
        this.namespace = id?.namespace;
        this.ref = id?.ref;
      } else {
        [this.namespace, this.ref] = id.split(ID_SEPARATOR);
      }
    }
  }

  toString() {
    return `${this.namespace}${ID_SEPARATOR}${this.ref}`;
  }
}

export class EntityManager<E extends Entity, ER = {}> {
  constructor(protected R: Repository) {
    if (Object.isExtensible(this.R)) {
      this.R[this.namespace] ??= {};
    }
  }

  get namespace(): string {
    return this.constructor.name.toLocaleLowerCase();
  }

  ref(obj: Partial<E>): string | undefined {
    // Overriden by derived classes if needed
    return;
  }

  id(obj: Partial<E>): EntityId {
    let id: EntityId;
    id = new EntityId(obj["id"]);
    id.namespace ||= this.namespace;
    id.ref ||= this.ref(obj);
    return id;
  }

  create(obj: Partial<E>): E {
    const id = this.id(obj);
    id.namespace ||= this.namespace;
    id.ref ||= uid.rnd();
    obj.id = id.toString();
    return create<E>(this.R, obj.id, obj);
  }

  get(obj: Partial<E>): E | undefined {
    const id = this.id(obj);
    return get<E>(this.R, id.toString());
  }

  getOrCreate(obj: Partial<E>): E {
    const id = this.id(obj);
    return getOrCreate(this.R, id.toString(), obj);
  }

  query(pred?: Predicate<E>): E[] {
    return query<E>(this.R, this.namespace, pred);
  }

  remove(obj: Partial<E>): E | undefined {
    const id = this.id(obj);
    return remove<E>(this.R, id.toString());
  }

  removeAll(pred?: Predicate<E>): E[] {
    return removeAll<E>(this.R, this.namespace, pred);
  }

  related(obj: Partial<E>): ER {
    return related<E, ER>(this.R, obj);
  }
}

type Predicate<E> =
  | Partial<E>
  // | ((v: E, i: number, a: E[]) => boolean)
  | ArrayFilterFnParams;

export function create<E extends Entity>(
  R: Repository,
  partialId: string,
  obj: Partial<E>,
): E {
  let id = new EntityId(partialId);
  id.ref ||= uid.rnd();
  obj.id = id.toString();
  R[id.namespace] ??= {};
  R[id.namespace][id.ref] = obj;
  return obj as E;
}

export function get<E extends Entity>(
  R: Repository,
  id: string,
): E | undefined {
  let { namespace, ref } = new EntityId(id);
  if (namespace in R) {
    return R[namespace][ref];
  }
}

export function getOrCreate<E extends Entity>(
  R: Repository,
  id: string,
  newObj: Partial<E>,
): E | undefined {
  let obj = get<E>(R, id);
  if (typeof obj === "undefined") {
    obj = create<E>(R, id, newObj);
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
export function query<E extends Entity>(
  R: Repository,
  namespace: string,
  pred?: Predicate<E>,
): E[] {
  let objects: E[] = [];
  if (namespace in R) {
    objects = Object.values<E>(R[namespace]);
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

export function remove<E extends Entity>(
  R: Repository,
  id: string,
): E | undefined {
  let { namespace, ref } = new EntityId(id);
  if (namespace in R && ref in R[namespace]) {
    const obj = R[namespace][ref];
    delete R[namespace][ref];
    return obj;
  }
}

export function removeAll<E extends Entity>(
  R: Repository,
  namespace: string,
  pred?: Predicate<E>,
): E[] {
  const objs = query<E>(R, namespace, pred);
  for (const obj of objs) {
    let { namespace, ref } = new EntityId(obj.id);
    delete R[namespace][ref];
  }
  return objs;
}

export function related<E extends Entity, ER extends any>(
  R: Repository,
  obj: Partial<E>,
): ER {
  return Object.entries(obj).reduce((rel, [key, value]) => {
    if (key.endsWith("Id") && value.indexOf(ID_SEPARATOR) >= 0) {
      rel[key] = get(this.R, value);
    }
    return [key, rel[key]];
  }, {}) as ER;
}
