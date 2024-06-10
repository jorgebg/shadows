import { EntityManager } from "@engine/repository";
import type { SimpleState } from "@engine/state";
import type { Equipment } from "../equipment";
import type { Band } from "./bands";
import { getCurrentBand } from "./bands";
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

export interface CharacterRelations {
  band: Band;
  location: Location;
}

export function power(char: Character) {
  return char.str + char.dex + char.int + char.mag;
}

export function getCurrentBandMembers({ G, ctx }: SimpleState): Character[] {
  const band = getCurrentBand({ G, ctx });
  return new Characters(G).query({ bandId: band.id });
}

export class Characters extends EntityManager<Character, CharacterRelations> {}
