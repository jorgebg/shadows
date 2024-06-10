import { EntityManager, type Entity } from "@engine/repository";
import type { UIElement } from "@game/ui";

export interface VisualEntity extends Entity, UIElement {}

export class Factory<E extends Entity> {
  constructor(protected manager: EntityManager<E>) {}
  build(obj: Partial<E>): E {
    return this.manager.create(obj);
  }
}
