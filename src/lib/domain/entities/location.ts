import type { GameState } from "@domain/state";
import { filter, get, type Entity } from "@engine/repository";
import type { SimpleState } from "@engine/state";
import { getCurrentPlayerBand } from "./bands";
import type { Map, Point } from "./map";

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
  cell: Point;
  typeId: LocationType["id"];
}

export function getRegionId({ x, y }: Point) {
  return `regions#${x},${y}`;
}

export function getCurrentPlayerRegion(state: SimpleState): Region {
  return get<Region>(state.G, getRegionId(getCurrentPlayerBand(state).cell));
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

export function getWorldMapId() {
  return "maps#world";
}

export function getWorldMap(G: GameState): Map {
  return get<Map>(G, getWorldMapId());
}
