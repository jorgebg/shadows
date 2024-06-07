import { get, type Entity } from "@engine/repository";
import type { GameState } from "@game/state";
import { DiagonalMovement, Grid } from "pathfinding";

export interface Point {
  x: number;
  y: number;
}

export interface Map extends Entity {
  size: Point;
}

export function travellable(map: Map, source: Point, target: Point) {
  return (
    new Grid(map.size.x, map.size.y)
      .getNeighbors({ ...source, walkable: true }, DiagonalMovement.Always)
      .filter((n) => n.x == target.x && n.y == target.y).length > 0
  );
}
export function getWorldMapId() {
  return "maps#world";
}
export function getWorldMap(G: GameState): Map {
  return get<Map>(G, getWorldMapId());
}
