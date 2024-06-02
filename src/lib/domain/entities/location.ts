import type { GameState } from "@domain/state";
import { filter, type Entity } from "@engine/repository";
import type { Point } from "./map";

export interface LocationType {
  id: keyof typeof LocationTypeMap;
  name: string;
  icon: string;
}

export const LocationTypeMap: Record<string, LocationType> = {
  TOWN: { id: "TOWN", name: "Town", icon: "🏘️" },
  CITY: { id: "CITY", name: "City", icon: "🏰" },
  FOREST: { id: "FOREST", name: "Forest", icon: "🌳" },
  DEEP_FOREST: { id: "DEEP_FOREST", name: "Deep Forest", icon: "🌲" },
  MOUNTAIN: { id: "MOUNTAIN", name: "Mountain", icon: "⛰️" },
  SNOW_MOUNTAIN: { id: "SNOW_MOUNTAIN", name: "Snow Mountain", icon: "🏔️" },
  RIVER: { id: "RIVER", name: "River", icon: "🏞️" },
  RUINS: { id: "RUINS", name: "Ruins", icon: "🏚️" },
} as const;

export interface Region extends Entity {
  cell: Point;
  name: string;
}

export interface Location extends Entity {
  regionId: Region["id"];
  typeId: LocationType["id"];
}

export function getRegionId({ x, y }: Point) {
  return `regions#${x},${y}`;
}

export function getCellIcons(G: GameState, cell: Point): string {
  return filter<Location>(G, "locations", {
    regionId: getRegionId(cell),
  }).reduce(
    (icons, location) => icons + LocationTypeMap[location.typeId].icon,
    "",
  );
}

// export function travellable(
//   { G, ctx }: SimpleState<GameState>,
//   location: Location,
// ) {
//   //WIP
//   const currentRegion = find<Region>(G.regions, G.currentRegionId);

//   return (
//     new Grid(3, 3)
//       .getNeighbors(
//         { ...currentRegion.point, walkable: true },
//         DiagonalMovement.Always,
//       )
//       .filter((v) => v.x == region.point.x && v.y == region.point.y).length > 0
//   );
// }
