import type { GameState } from "@domain/state";
import { entity, find, type Entity } from "@engine/entities";
import type { SimpleState } from "@engine/state";
import { randomChoice, rollD3 } from "@engine/utils/random";
import { human } from "fantastical";
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
  region: string;
  type: LocationType["id"];
}

export interface Region extends Entity {
  point: Point;
  locations: Location[];
}

export function generateRegion(point: Point): Region {
  const { x, y } = point;
  const name = CardinalPointsGrid[x][y];
  const id = `${x},${y}`;
  const region = entity<Region>({ id, name, point, locations: [] });

  const numLocations = rollD3();
  const locationTypes = Object.values(LocationTypeMap);
  for (let i = 0; i < numLocations; i++) {
    const type = randomChoice(locationTypes);
    locationTypes.splice(locationTypes.indexOf(type), 1);
    const location = entity<Location>({
      id: `region_${region.id}:location_${region.locations.length}`,
      name: human(),
      region: region.id,
      type: type.id,
    });
    region.locations.push(location);
  }
  return region;
}

export function getRegionIcons(region: Region): string {
  return region.locations.reduce(
    (icons, location) => icons + LocationTypeMap[location.type].icon,
    "",
  );
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
