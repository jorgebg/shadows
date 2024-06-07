import { get, type Entity } from "@engine/repository";
import type { SimpleState } from "@engine/state";
import { getCurrentBand } from "./bands";
import type { Point } from "./map";

export interface Region extends Entity {
  cell: Point;
  name: string;
}
export function getRegionId({ x, y }: Point) {
  return `regions#${x},${y}`;
}
export function getCurrentBandRegion(state: SimpleState): Region {
  return get<Region>(state.G, getRegionId(getCurrentBand(state).cell));
}

// WIP Start Refactor here
// class Regions extends EntityManager {
//  static id(region) {
//    if (region.cell)
//    return `regions#${region.cell.x},${region.cell.y}`
//}
//}
