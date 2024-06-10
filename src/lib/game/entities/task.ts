import { EntityId, EntityManager, type Entity } from "@engine/repository";
import type { UIElement } from "@game/ui";
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

export interface TaskRelations {
  type: TaskType;
  character: Character;
  location: Location;
}

export class Tasks extends EntityManager<Task, TaskRelations> {
  ref(task) {
    if (task.characterId) {
      const id = new EntityId(task.characterId);
      return id.ref;
    }
  }
  related(task: Task) {
    const related = super.related(task);
    if (task.typeId) {
      related.type = TaskTypeMap[task.typeId];
    }
    return related;
  }
}
