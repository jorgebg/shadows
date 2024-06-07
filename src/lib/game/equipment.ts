import { get } from "@engine/repository";
import type { GameState } from "@game/state";
import type { UIElement } from "@game/ui";
import type { Character } from "./entities/character";
import type { Item, ItemType } from "./entities/item";

export interface Equipment {
  primary: Item["id"];
  secondary: Item["id"];
  shield: Item["id"];
  armor: Item["id"];
  amulet: Item["id"];
}

export type EquipmentSlotId = keyof Equipment;

export interface EquipmentSlot extends UIElement {
  id: EquipmentSlotId;
  type: ItemType;
}

export const EquipmentSlotList: EquipmentSlot[] = [
  {
    id: "primary",
    icon: "counter_1",
    name: "Weapon 1",
    type: "weapon",
  },
  {
    id: "secondary",
    icon: "counter_2",
    name: "Weapon 2",
    type: "weapon",
  },
  {
    id: "shield",
    icon: "shield",
    name: "Shield",
    type: "shield",
  },
  {
    id: "armor",
    icon: "apparel",
    name: "Armor",
    type: "armor",
  },
  {
    id: "amulet",
    icon: "diamond",
    name: "amulet",
    type: "amulet",
  },
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

export function equipment(
  G: GameState,
  member: Character,
  slot: EquipmentSlot,
): Item {
  const itemId = get<Character>(G, member.id)?.equipment[slot.id];
  if (typeof itemId !== undefined) {
    return get<Item>(G, itemId);
  }
}
