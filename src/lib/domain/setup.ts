import { create } from "@engine/repository";
import { randomChoice } from "@engine/utils/random";
import { titleize } from "@engine/utils/string";
import { randomSpeciesColorSet } from "@icons/species";
import type { Ctx } from "boardgame.io";
import type { RandomAPI } from "boardgame.io/src/plugins/random/random";
import { species } from "fantastical";
import { getPlayerBandId, type Band } from "./entities/bands";
import { Race, type Character } from "./entities/character";
import type { TurnLog } from "./entities/event";
import { ItemFactory, type Item } from "./entities/item";
import { type Map } from "./entities/map";
import { CardinalPointsGrid, generateRegion } from "./entities/region";
import { type GameState } from "./state";

export function setupG(
  { ctx, random, ...plugins }: { ctx: Ctx; random: RandomAPI },
  setupData: any,
): GameState {
  const regions = [];
  for (let x = 0; x < CardinalPointsGrid.length; x++) {
    const lat = CardinalPointsGrid[x];
    for (let y = 0; y < lat.length; y++) {
      regions.push(generateRegion({ x, y }));
    }
  }
  const currentRegionId = randomChoice(regions).id;

  const assignments = {};

  const G = {} as GameState;
  Object.assign(G, { currentRegionId, regions, assignments });
  //---
  const items = new ItemFactory(G, "items");
  create<Map>(G, "maps#world", { size: { x: 3, y: 3 } });
  for (let nPlayer = 0; nPlayer < ctx.numPlayers; nPlayer++) {
    const playerId = nPlayer.toString();
    const band = create<Band>(G, getPlayerBandId(playerId), {
      playerId: playerId.toString(),
      locationId: "locations#1", //TODO
    });
    const bandId = band.id;
    for (let i = 0; i < 3; i++) {
      const race = randomChoice(
        [Race.Human, Race.Elf, Race.Dwarf],
        random.Number,
      );
      const name =
        race == Race.Human
          ? species.human()
          : species[race](randomChoice(["female", "male"], random.Number));

      const icon = {
        component: titleize(race),
        props: randomSpeciesColorSet(race, random.Number),
        name,
      };
      const attrPool = random.Shuffle([3, 2, 1]);
      const attrs = {
        str: attrPool.pop(),
        dex: attrPool.pop(),
        int: attrPool.pop(),
        mag: 0,
      };
      const equipment = {
        primary: null,
        secondary: null,
        shield: null,
        armor: null,
        amulet: null,
      };
      switch (race) {
        case Race.Human:
          equipment.primary = items.Sword({ bandId }).id;
          equipment.secondary = items.Bow({ bandId }).id;
          attrs[randomChoice(["str", "dex", "int"], random.Number)] += 1;
          break;
        case Race.Elf:
          equipment.primary = items.Sword({ bandId }).id;
          equipment.secondary = items.Bow({ bandId }).id;
          attrs.mag = 1;
          break;
        case Race.Dwarf:
          equipment.primary = items.Axe({ bandId }).id;
          equipment.shield = items.Shield({ bandId }).id;
          attrs.str += 2;
          attrs.int -= 1;
          break;
      }
      create<Character>(G, "characters", {
        bandId: band.id,
        name,
        race,
        icon,
        ...attrs,
        equipment,
        skills: [],
      });
    }

    items.PaddedJacket({ bandId });
    items.Ring({ bandId });
    for (let i = 0; i < 3; i++) {
      items.Kingsfoil({ bandId });
    }
  }
  create<TurnLog>(G, "log#0", {
    turn: 0,
    log: [
      {
        message:
          "A long shadow has fell upon this land. Find where the shadows lie and slay the source.",
      },
    ],
  });

  create<Item>(G, "items", { name: "Control Item", type: "consumable" });
  return G;
}
