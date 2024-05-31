import { filter, get } from "@engine/repository";
import type { SimpleState } from "@engine/state";
import type { Band } from "./bands";
import { getCurrentPlayerBandId } from "./bands";
import type { VisualEntity } from "./base";
import type { Equipment } from "./equipment";

export enum Race {
  Human = "human",
  Elf = "elf",
  Dwarf = "dwarf",
  Orc = "orc",
}

export interface Character extends VisualEntity {
  bandId: Band["id"];
  race: Race;
  str: number;
  dex: number;
  int: number;
  mag: number;
  equipment: Equipment;
  skills: [];
}

export function power(char: Character) {
  return char.str + char.dex + char.int + char.mag;
}

export function getCurrentPlayerBandMembers({
  G,
  ctx,
}: SimpleState): Character[] {
  const band = get<Band>(G, getCurrentPlayerBandId(ctx));
  return filter<Character>(G, "characters", { bandId: band.id });
}
