import { entity, type Entity } from "@engine/entities";

export type TaskId = "explore" | "market" | "recruit";

export interface Task extends Entity {
  id: TaskId;
  description: string;
}

export const TaskList: Task[] = [
  entity<Task>({
    id: "explore",
    name: "Explore",
    icon: "explore",
    description: "Track enemies and fight them",
  }),
  entity<Task>({
    id: "market",
    name: "Market",
    icon: "storefront",
    description: "Buy or sell items",
  }),
  entity<Task>({
    id: "recruit",
    name: "Recruit",
    icon: "group_add",
    description: "Look for new members",
  }),
];
