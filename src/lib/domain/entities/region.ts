import type { GameState } from "@domain/state";
import { entity, find, type Entity } from "@engine/entities";
import type { SimpleState } from "@engine/state";
import { randomChoice } from "@engine/utils/random";
import { DiagonalMovement, Grid } from "pathfinding";

export interface Point {
  x: number;
  y: number;
}

export const CardinalPointsGrid = [
  ["North-West", "North", "North-East"],
  ["West", "Center", "East"],
  ["South-West", "South", "South-East"],
];

export const BiomeList = ["Forest", "Mountain", "Plain"];

export interface Region extends Entity {
  point: Point;
  biome: (typeof BiomeList)[number];
}

export function region(point: Point): Region {
  const { x, y } = point;
  const name = CardinalPointsGrid[x][y];
  const id = name
    .split("-")
    .map((n) => n[0])
    .join("");
  const biome = randomChoice(BiomeList);
  return entity<Region>({ id, name, point, biome });
}

export function travellable(
  { G, ctx }: SimpleState<GameState>,
  region: Region,
) {
  const currentRegion = find<Region>(G.regions, G.currentRegionID);

  return (
    new Grid(3, 3)
      .getNeighbors(
        { ...currentRegion.point, walkable: true },
        DiagonalMovement.Always,
      )
      .filter((v) => v.x == region.point.x && v.y == region.point.y).length > 0
  );
}
