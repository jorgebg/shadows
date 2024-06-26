import { randomChoice, randomInt } from "@engine/utils/random";

export const HUMAN_SKIN_COLORS = [
  "#6A462F",
  "#A57939",
  "#C19A65",
  "#DEBB90",
  "#FADCBC",
  "#FCEBD9",
];

export const HUMAN_HAIR_COLORS = [
  "#000000",
  "#5E5E5E",
  "#5E3630",
  "#9C5449",
  "#B65C47",
];

export const HUMAN_RARE_HAIR_COLORS = [
  "#BF1E2D",
  "#C16F19",
  "#D93838",
  "#DACC90",
  "#ECE3C9",
  "#FFFFFF",
];

export const ORC_SKIN_COLORS = [
  "#634F00",
  "#786205",
  "#7D7B11",
  "#82530E",
  "#935711",
  "#A66B17",
  "#AC811F",
  "#D09B28",
  "#E3A78C",
];

export const ORC_HAIR_COLORS = [
  "#000000",
  "#330600",
  "#371E00",
  "#451A02",
  "#452700",
  "#462800",
];

export interface SpeciesColorSet {
  skin: string;
  hair: string;
}

export type SPECIES = "human" | "elf" | "dwarf" | "orc";

export function randomSpeciesColorSet(
  iconName: SPECIES,
  random?: typeof Math.random,
): SpeciesColorSet {
  let skin, hair;
  switch (iconName) {
    case "human":
    case "elf":
    case "dwarf":
      skin = randomChoice(HUMAN_SKIN_COLORS, random);
      hair =
        randomInt(1, 100) < 95
          ? randomChoice(HUMAN_HAIR_COLORS, random)
          : randomChoice(HUMAN_RARE_HAIR_COLORS, random);
      break;
    case "orc":
      skin = randomChoice(ORC_SKIN_COLORS, random);
      hair = randomChoice(ORC_HAIR_COLORS, random);
      break;
  }
  return { skin, hair };
}
