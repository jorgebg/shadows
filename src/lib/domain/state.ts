import type { Character } from "./entities/character";
import type { Item } from "./entities/item";
import type { Region } from "./entities/region";
import type { Task } from "./entities/task";

export interface GameState {
  currentRegionID: string;
  regions: Region[];
  members: Character[];
  items: Item[];
  assignments: {
    [key: string]: Task["id"];
  };
  events: string[][]; // turn: event lines
}
