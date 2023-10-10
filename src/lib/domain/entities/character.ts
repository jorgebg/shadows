import { type Entity } from "@engine/entities";
import type { Equipment } from "./equipment";

export const FACES = [
  "face",
  "face_2",
  "face_2",
  "face_3",
  "face_4",
  "face_5",
  "face_6",
];

export const FACE_COLORS = Array.from({ length: 18 }, (v, k) => k * 20);

export enum Race {
  Human = "human",
  Elf = "elf",
  Dwarf = "dwarf",
  Orc = "orc",
}

export interface Character extends Entity {
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
