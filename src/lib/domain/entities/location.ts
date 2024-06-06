import type { GameState } from "@domain/state";
import { filter, type Entity } from "@engine/repository";
import type { Point } from "./map";

export const CardinalPointsGrid = [
  ["North-West", "North", "North-East"],
  ["West", "Center", "East"],
  ["South-West", "South", "South-East"],
];

export interface LocationType {
  id: keyof typeof LocationTypeMap;
  name: string;
  icon: string;
}

export const LocationTypeMap: Record<string, LocationType> = {
  TOWN: { id: "TOWN", name: "Town", icon: "🏘️" },
  CITY: { id: "CITY", name: "City", icon: "🏰" },
  FOREST: { id: "FOREST", name: "Forest", icon: "🌲" },
  MOUNTAIN: { id: "MOUNTAIN", name: "Mountain", icon: "⛰️" },
  RIVER: { id: "RIVER", name: "River", icon: "🏞️" },
  RUINS: { id: "RUINS", name: "Ruins", icon: "🏚️" },
} as const;

export interface Location extends Entity {
  cell: Point;
  typeId: LocationType["id"];
}

export function getCellLocations(G: GameState, cell: Point): Location[] {
  return filter<Location>(G, "locations", { cell });
}
export function getCellIcons(G: GameState, cell: Point): string {
  return getCellLocations(G, cell).reduce(
    (icons, location) => icons + LocationTypeMap[location.typeId].icon,
    "",
  );
}
