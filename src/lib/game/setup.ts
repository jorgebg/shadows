import { fillArray, padArray } from "@engine/utils/array";
import { randomChoice, randomInt } from "@engine/utils/random";
import { titleize } from "@engine/utils/string";
import { randomSpeciesColorSet } from "@icons/species";
import type { Ctx } from "boardgame.io";
import type { RandomAPI } from "boardgame.io/src/plugins/random/random";
import { human, species } from "fantastical";
import { Bands } from "./entities/bands";
import { Characters, Race } from "./entities/character";
import { ItemFactory, Items } from "./entities/item";
import type { Location } from "./entities/location";
import {
  LocationTypeMap,
  Locations,
  type LocationType,
} from "./entities/location";
import { TurnLogs } from "./entities/log";
import { Maps, getWorldMapRef, type Point } from "./entities/map";
import { Regions } from "./entities/region";
import { type GameState } from "./state";

export function setupG(
  { ctx, random, ...plugins }: { ctx: Ctx; random: RandomAPI },
  setupData: any,
): GameState {
  const G = {} as GameState;
  //---
  const itemFactory = new ItemFactory(new Items(G));
  // World map
  const world = {
    WIDTH: 3,
    HEIGHT: 3,
  };
  new Maps(G).create({
    id: getWorldMapRef(),
    size: { x: world.WIDTH, y: world.HEIGHT },
  });
  // Regions
  const cells: Point[] = [];
  for (let y = 0; y < world.HEIGHT; y++) {
    for (let x = 0; x < world.WIDTH; x++) {
      const cell = { x, y };
      cells.push({ x, y });
      new Regions(G).create({
        cell,
        name: human({ allowMultipleNames: false }),
      });
    }
  }
  // Locations
  const locationTypePool: LocationType[] = [
    ...random.Shuffle(
      padArray(cells.length, [
        ...fillArray(cells.length / 1.5, LocationTypeMap.TOWN),
        ...fillArray(cells.length / 4.5, LocationTypeMap.CITY),
        ...fillArray(cells.length / 9, LocationTypeMap.RUINS),
      ]),
    ),
    ...random.Shuffle(
      padArray(cells.length, [
        ...fillArray(cells.length / 1.5, LocationTypeMap.FOREST),
        ...fillArray(cells.length / 3, LocationTypeMap.MOUNTAIN),
      ]),
    ),
    ...random.Shuffle(
      padArray(cells.length, [
        ...fillArray(cells.length / 3, LocationTypeMap.RIVER),
      ]),
    ),
  ].reverse();
  const towns: Location[] = [];
  let locationIndex = randomInt(0, cells.length - 1, random.Number);
  while (locationTypePool.length > 0) {
    const type = locationTypePool.pop();
    if (type) {
      const location = new Locations(G).create({
        cell: cells[locationIndex % cells.length],
        typeId: type.id,
      });
      if (type == LocationTypeMap.TOWN) {
        towns.push(location);
      }
    }
    locationIndex++;
  }

  // Player Bands
  for (let nPlayer = 0; nPlayer < ctx.numPlayers; nPlayer++) {
    const playerId = nPlayer.toString();
    const location = randomChoice<Location>(towns, random.Number);
    const band = new Bands(G).create({
      playerId: playerId.toString(),
      cell: location.cell,
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
          equipment.primary = itemFactory.Sword({ bandId }).id;
          equipment.secondary = itemFactory.Bow({ bandId }).id;
          attrs[randomChoice(["str", "dex", "int"], random.Number)] += 1;
          break;
        case Race.Elf:
          equipment.primary = itemFactory.Sword({ bandId }).id;
          equipment.secondary = itemFactory.Bow({ bandId }).id;
          attrs.mag = 1;
          break;
        case Race.Dwarf:
          equipment.primary = itemFactory.Axe({ bandId }).id;
          equipment.shield = itemFactory.Shield({ bandId }).id;
          attrs.str += 2;
          attrs.int -= 1;
          break;
      }
      new Characters(G).create({
        bandId: band.id,
        locationId: location.id,
        name,
        race,
        icon,
        ...attrs,
        equipment,
        skills: [],
      });
    }

    itemFactory.PaddedJacket({ bandId });
    itemFactory.Ring({ bandId });
    for (let i = 0; i < 3; i++) {
      itemFactory.Kingsfoil({ bandId });
    }
  }

  // Log
  new TurnLogs(G).create({
    number: 0,
    log: [
      {
        message:
          "A long shadow has fell upon this land. Find where the shadows lie and slay the source.",
      },
    ],
  });

  return G;
}
