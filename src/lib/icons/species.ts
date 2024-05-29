import { randomChoice, weightedRandomChoice } from "@engine/utils/random";

export const HUMAN_SKIN_COLORS = [
  "#6A462F",
  "#A57939",
  "#C19A65",
  "#DEBB90",
  "#FADCBC",
];

export const HUMAN_HAIR_COLORS = [
  "#000000",
  "#5E5E5E",
  "#5E3630",
  "#9C5449",
  "#B65C47",
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

export function randomSpeciesColorSet(iconName: SPECIES): SpeciesColorSet {
  let skin, hair;
  switch (iconName) {
    case "human":
    case "elf":
    case "dwarf":
      skin = randomChoice(HUMAN_SKIN_COLORS);
      hair = weightedRandomChoice(
        HUMAN_HAIR_COLORS.map((item, index) => ({
          item,
          weight: index > 5 ? 1 : 20,
        })),
      );
      break;
    case "orc":
      skin = randomChoice(ORC_SKIN_COLORS);
      hair = randomChoice(ORC_HAIR_COLORS);
      break;
  }
  return { skin, hair };
}
