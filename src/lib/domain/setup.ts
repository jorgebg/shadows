import { create } from "@engine/repository";
import { fillArray, padArray } from "@engine/utils/array";
import { randomChoice, randomInt } from "@engine/utils/random";
import { titleize } from "@engine/utils/string";
import { randomSpeciesColorSet } from "@icons/species";
import type { Ctx } from "boardgame.io";
import type { RandomAPI } from "boardgame.io/src/plugins/random/random";
import { human, species } from "fantastical";
import { getPlayerBandId, type Band } from "./entities/bands";
import { Race, type Character } from "./entities/character";
import type { TurnLog } from "./entities/event";
import { ItemFactory } from "./entities/item";
import type { Location } from "./entities/location";
import {
  LocationTypeMap,
  getRegionId,
  getWorldMapId,
  type LocationType,
  type Region,
} from "./entities/location";
import { type Map, type Point } from "./entities/map";
import { type GameState } from "./state";

export function setupG(
  { ctx, random, ...plugins }: { ctx: Ctx; random: RandomAPI },
  setupData: any,
): GameState {
  const assignments = {};

  const G = {} as GameState;
  Object.assign(G, { assignments });
  //---
  const items = new ItemFactory(G, "items");
  // World map
  const world = {
    WIDTH: 3,
    HEIGHT: 3,
  };
  create<Map>(G, getWorldMapId(), {
    size: { x: world.WIDTH, y: world.HEIGHT },
  });
  // Regions
  const cells: Point[] = [];
  for (let y = 0; y < world.HEIGHT; y++) {
    for (let x = 0; x < world.WIDTH; x++) {
      const cell = { x, y };
      cells.push({ x, y });
      create<Region>(G, getRegionId(cell), {
        cell,
        name: human({ allowMultipleNames: false }),
      });
    }
  }
  // Locations
  const locationTypePool: LocationType[] = [
    ...random.Shuffle(
      padArray(cells.length, [
        ...fillArray(cells.length / 2, LocationTypeMap.TOWN),
        ...fillArray(cells.length / 4, LocationTypeMap.CITY),
      ]),
    ),
    ...random.Shuffle(
      padArray(cells.length, [
        ...fillArray(cells.length / 3, LocationTypeMap.FOREST),
        ...fillArray(cells.length / 3, LocationTypeMap.DEEP_FOREST),
        ...fillArray(cells.length / 4, LocationTypeMap.MOUNTAIN),
        ...fillArray(cells.length / 9, LocationTypeMap.SNOW_MOUNTAIN),
      ]),
    ),
    ...random.Shuffle(
      padArray(cells.length, [
        ...fillArray(cells.length / 4, LocationTypeMap.RIVER),
      ]),
    ),
    ...random.Shuffle(
      padArray(cells.length, [
        ...fillArray(cells.length / 6, LocationTypeMap.RUINS),
      ]),
    ),
  ].reverse();
  const locations: Location[] = [];
  let locationIndex = randomInt(0, cells.length - 1, random.Number);
  while (locationTypePool.length > 0) {
    const type = locationTypePool.pop();
    if (type) {
      locations.push(
        create<Location>(G, "locations", {
          cell: cells[locationIndex % cells.length],
          typeId: type.id,
        }),
      );
    }
    locationIndex++;
  }

  // Player Bands
  for (let nPlayer = 0; nPlayer < ctx.numPlayers; nPlayer++) {
    const playerId = nPlayer.toString();
    const band = create<Band>(G, getPlayerBandId(playerId), {
      playerId: playerId.toString(),
      cell: {
        x: randomInt(0, world.WIDTH - 1),
        y: randomInt(0, world.HEIGHT - 1),
      },
    });
    const bandId = band.id;
    // Player Band Characters
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

  // Log
  create<TurnLog>(G, "log#0", {
    turn: 0,
    log: [
      {
        message:
          "A long shadow has fell upon this land. Find where the shadows lie and slay the source.",
      },
    ],
  });

  return G;
}
