import type { Entity } from "@engine/repository";
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
      .filter((v) => v.x == target.x && v.y == target.y).length > 0
  );
}
