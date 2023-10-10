import { type Entity } from "@engine/entities";

export type ItemType = "weapon" | "shield" | "armor" | "jewel" | "consumable";

export interface Item extends Entity {
  type: ItemType;
}
