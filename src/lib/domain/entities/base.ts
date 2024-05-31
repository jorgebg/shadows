import type { GameState } from "@domain/state";
import type { UIElement } from "@domain/ui";
import { create, type Entity } from "@engine/repository";

export interface VisualEntity extends Entity, UIElement {}

export class Factory<T extends Entity> {
  constructor(
    protected G: GameState,
    protected namespace: string,
  ) {}
  build(obj: Partial<T>): T {
    return create<T>(this.G, this.namespace, obj);
  }
}
