import { create, type Entity } from "@engine/repository";
import type { GameState } from "@game/state";
import type { UIElement } from "@game/ui";

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
