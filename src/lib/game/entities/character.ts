import { get, query } from "@engine/repository";
import type { SimpleState } from "@engine/state";
import type { Equipment } from "../equipment";
import type { Band } from "./bands";
import { getCurrentBandId } from "./bands";
import type { VisualEntity } from "./base";
import type { Location } from "./location";

export enum Race {
  Human = "human",
  Elf = "elf",
  Dwarf = "dwarf",
  Orc = "orc",
}

export interface Character extends VisualEntity {
  bandId: Band["id"];
  locationId: Location["id"];
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

export function getCurrentBandMembers({ G, ctx }: SimpleState): Character[] {
  const band = get<Band>(G, getCurrentBandId(ctx));
  return query<Character>(G, "characters", { bandId: band.id });
}
