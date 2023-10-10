import { entity, type Entity } from "@engine/entities";
import type { Character } from "./character";
import type { Item, ItemType } from "./item";

export interface Equipment {
  primary: Item["id"];
  secondary: Item["id"];
  shield: Item["id"];
  armor: Item["id"];
  jewel: Item["id"];
}

export type EquipmentSlotId = keyof Equipment;

export interface EquipmentSlot extends Entity {
  id: EquipmentSlotId;
  description: string;
  type: ItemType;
}

export const EquipmentSlotList: EquipmentSlot[] = [
  entity<EquipmentSlot>({
    id: "primary",
    icon: "counter_1",
    name: "Weapon 1",
    type: "weapon",
  }),
  entity<EquipmentSlot>({
    id: "secondary",
    icon: "counter_2",
    name: "Weapon 2",
    type: "weapon",
  }),
  entity<EquipmentSlot>({
    id: "shield",
    icon: "shield",
    name: "Shield",
    type: "shield",
  }),
  entity<EquipmentSlot>({
    id: "armor",
    icon: "apparel",
    name: "Armor",
    type: "armor",
  }),
  entity<EquipmentSlot>({
    id: "jewel",
    icon: "diamond",
    name: "Jewel",
    type: "jewel",
  }),
];

export function equipped(members: Character[], itemId: Item["id"]): Character {
  for (const member of members) {
    for (const equippedItem of Object.values(member.equipment)) {
      if (equippedItem == itemId) {
        return member;
      }
    }
  }
}
