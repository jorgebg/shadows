import { entity } from "@engine/entities";
import { randomChoice, randomInt } from "@engine/utils/random";
import { species } from "fantastical";
import { FACES, FACE_COLORS, Race, type Character } from "./entities/character";
import { type Item } from "./entities/item";
import { CardinalPointsGrid, generateRegion } from "./entities/region";
import { type GameState } from "./state";

export function setupG(): GameState {
  const regions = [];
  for (let x = 0; x < CardinalPointsGrid.length; x++) {
    const lat = CardinalPointsGrid[x];
    for (let y = 0; y < lat.length; y++) {
      regions.push(generateRegion({ x, y }));
    }
  }
  const currentRegionID = randomChoice(regions).id;

  const items: Item[] = [];
  for (let i = 0; i < 3; i++) {
    items.push(entity<Item>({ name: "Sword", type: "weapon" }));
  }
  items.push(entity<Item>({ name: "Axe", type: "weapon" }));
  items.push(entity<Item>({ name: "Kingsfoil", type: "consumable" }));

  const members: Character[] = [];
  const faces = new Set<string>(FACES);
  const colors = new Set<number>(FACE_COLORS);
  for (let i = 0; i < 3; i++) {
    const face = randomChoice(Array.from(faces));
    const color = randomChoice(Array.from(colors));
    faces.delete(face);
    colors.delete(color);
    const race = randomChoice([Race.Human, Race.Elf, Race.Dwarf]);
    const name = species[race]();
    members.push(
      entity<Character>({
        name,
        race,
        icon: { svg: `icons/${race}.svg`, name },
        str: randomInt(1, 3),
        dex: randomInt(1, 3),
        int: randomInt(1, 3),
        mag: 0,
        equipment: {
          primary: items[i].id,
          secondary: null,
          shield: null,
          armor: null,
          jewel: null,
        },
        skills: [],
      }),
    );
  }
  const assignments = {};
  const events = [
    [
      "A long shadow has fell upon this land. Find where the shadows lie and slay the source.",
    ],
  ];

  return { currentRegionID, regions, members, items, assignments, events };
}
