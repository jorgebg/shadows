import type { Band } from "./bands";
import { Factory, type VisualEntity } from "./base";

export type ItemType = "weapon" | "shield" | "armor" | "amulet" | "consumable";

export interface Item extends VisualEntity {
  type: ItemType;
  bandId: Band["id"];
}

export class ItemFactory extends Factory<Item> {
  Sword(obj) {
    return this.build({
      name: "Sword",
      type: "weapon",
      icon: "🗡️",
      ...obj,
    });
  }
  Axe(obj) {
    return this.build({
      name: "Axe",
      type: "weapon",
      icon: "🪓",
      ...obj,
    });
  }
  Bow(obj) {
    return this.build({
      name: "Bow",
      type: "weapon",
      icon: "🏹",
      ...obj,
    });
  }
  Shield(obj) {
    return this.build({
      name: "Shield",
      type: "shield",
      icon: "🛡️",
      ...obj,
    });
  }
  PaddedJacket(obj) {
    return this.build({
      name: "Padded Jacket",
      type: "armor",
      icon: "🧥",
      ...obj,
    });
  }
  Ring(obj) {
    return this.build({
      name: "Ring",
      type: "amulet",
      icon: "💍",
      ...obj,
    });
  }
  Kingsfoil(obj) {
    return this.build({
      name: "Kingsfoil",
      type: "consumable",
      icon: "🌿",
      ...obj,
    });
  }
}
