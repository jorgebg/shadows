import type { Band } from "./entities/bands";
import type { TurnLog } from "./entities/event";
import type { Item } from "./entities/item";
import type { Map } from "./entities/map";
import type { Region } from "./entities/region";
import type { Task } from "./entities/task";

export interface GameState {
  // Old entities pattern
  currentRegionId: string;
  regions: Region[];
  items: Item[];
  assignments: {
    [key: string]: Task["id"];
  };
  // New repository pattern
  maps: Record<string, Map>;
  bands: Record<string, Band>;
  events: Record<string, TurnLog>;
}
