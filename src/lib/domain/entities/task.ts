import type { UIElement } from "@domain/ui";
import type { Entity } from "@engine/repository";
import type { Character } from "./character";
import type { Location } from "./location";

export interface TaskType extends UIElement {
  id: "explore" | "market" | "recruit";
  description: string;
}

export const TaskTypeMap: Record<string, TaskType> = {
  explore: {
    id: "explore",
    name: "Explore",
    icon: "explore",
    description: "Track enemies and fight them",
  },
  market: {
    id: "market",
    name: "Market",
    icon: "storefront",
    description: "Buy or sell items",
  },
  recruit: {
    id: "recruit",
    name: "Recruit",
    icon: "group_add",
    description: "Look for new members",
  },
};

export interface Task extends Entity {
  typeId: TaskType["id"];
  characterId: Character["id"];
  locationId: Location["id"];
}
