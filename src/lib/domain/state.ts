import type { Band } from "./entities/bands";
import type { TurnLog } from "./entities/event";
import type { Item } from "./entities/item";
import type { Map } from "./entities/map";
import type { Region } from "./entities/region";
import type { TaskType } from "./entities/task";

export interface GameState {
  // Old entities pattern
  assignments: {
    [key: string]: TaskType["id"];
  };
  // New repository pattern
  maps: Record<string, Map>;
  regions: Record<string, Region>;
  locations: Record<string, Location>;
  bands: Record<string, Band>;
  items: Item[];
  log: Record<string, TurnLog>;
}
