import { EntityManager, type Entity } from "@engine/repository";
import type { SimpleState } from "@engine/state";
import { getCurrentBand } from "./bands";
import type { Point } from "./map";

export interface Region extends Entity {
  cell: Point;
  name: string;
}

export function getCurrentBandRegion(state: SimpleState): Region {
  return new Regions(state.G).get({ cell: getCurrentBand(state).cell });
}

export class Regions extends EntityManager<Region> {
  ref(region) {
    if (region.cell) {
      return `${region.cell.x},${region.cell.y}`;
    }
  }
}
