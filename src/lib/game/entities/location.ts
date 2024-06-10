import { EntityManager, type Entity } from "@engine/repository";
import type { GameState } from "@game/state";
import type { Point } from "./map";

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
  name: string;
}

export interface LocationRelations {
  type: LocationType;
}

export function getCellLocations(G: GameState, cell: Point): Location[] {
  return new Locations(G).query({ cell });
}
export function getCellIcons(G: GameState, cell: Point): string {
  return getCellLocations(G, cell).reduce(
    (icons, location) => icons + LocationTypeMap[location.typeId].icon,
    "",
  );
}

export class Locations extends EntityManager<Location, LocationRelations> {
  create(obj) {
    obj = super.create(obj);
    if (obj.typeId) {
      obj.name = LocationTypeMap[obj.typeId].name;
    }
    return obj;
  }
  related(location: Location) {
    const related = super.related(location);
    if (location.typeId) {
      related.type = LocationTypeMap[location.typeId];
    }
    return related;
  }
}
