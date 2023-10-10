import { entity, find } from "@engine/entities";
import { confirm, type Option } from "@engine/options";
import { randomChoice, randomInt } from "@engine/utils/random";
import { titleize } from "@engine/utils/string";
import type { Ctx, Game } from "boardgame.io";
import { human } from "fantastical";
import ItemsScreen from "./components/ItemsScreen.svelte";
import MapScreen from "./components/MapScreen.svelte";
import RegionScreen from "./components/RegionScreen.svelte";
import TeamScreen from "./components/TeamScreen.svelte";
import {
  FACES,
  FACE_COLORS,
  Race,
  power,
  type Character,
} from "./entities/character";
import { EquipmentSlotList, equipped } from "./entities/equipment";
import { type Item } from "./entities/item";
import { CardinalPointsGrid, region } from "./entities/region";
import { TaskList } from "./entities/task";
import { getAllMoves } from "./moves";
import {
  AssignTask,
  DisbandMember,
  EquipItem,
  RemoveItem,
  StartTasks,
  Travel,
  UnequipItem,
  UseItem,
  UseSkill,
} from "./moves/campaign";
import { type GameState } from "./state";

export const moves = getAllMoves();

export function setupG(): GameState {
  const regions = [];
  for (let x = 0; x < CardinalPointsGrid.length; x++) {
    const lat = CardinalPointsGrid[x];
    for (let y = 0; y < lat.length; y++) {
      regions.push(region({ x, y }));
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
    members.push(
      entity<Character>({
        name: human(),
        icon: { name: face, color },
        race: Race.Human,
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

export function optionTree(state: { G: GameState; ctx: Ctx }): Option[] {
  const { G, ctx } = state;
  let tree = [];
  if (!ctx.gameover) {
    tree = [
      {
        title: "Map",
        description: "Map of locations",
        icon: "map",
        component: MapScreen,
        children: G.regions.map((region) => ({
          id: `region:${region.id}`,
          title: region.name,
          description: titleize(region.biome),
          args: { region },
          children: [
            {
              description: `Move to region ${region.name}`,
              icon: "hiking",
              args: { region },
              move: Travel,
            },
          ],
        })),
      },
      {
        title: "Region",
        description: "Assign tasks for the day",
        icon: "signpost",
        component: RegionScreen,
        children: [
          ...TaskList.map((task) => ({
            title: task.name,
            description: task.description,
            icon: task.icon,
            args: { task },
            children: G.members.map((member) => ({
              args: { member },
              move: AssignTask,
            })),
          })),
          confirm({
            title: "Start",
            icon: { name: "start", color: "yellow" },
            move: StartTasks,
          }),
        ],
      },
      {
        title: "Team",
        description: "Manage members",
        icon: "groups",
        component: TeamScreen,
        children: G.members.map((member) => ({
          title: member.name,
          id: member.id,
          description: `Power ${power(member)}, ${
            Object.values(member.equipment)
              .filter((i) => i)
              .map((i) => find(G.items, i).name)
              .join(", ") || "no equipment"
          }`,
          icon: member.icon,
          args: { member },
          children: [
            {
              title: "Equipment",
              description: "Manage equipped items",
              icon: "accessibility",
              children: EquipmentSlotList.map((slot) => ({
                ...slot,
                title: slot.name,
                args: { slot },
                description:
                  find(G.items, member.equipment[slot.id])?.name || "<empty>",
                children: [
                  {
                    id: "unequip",
                    title: "Unequip",
                    icon: "close",
                    move: UnequipItem,
                  },
                  ...G.items
                    .filter((item) => item.type == slot.type)
                    .map((item) => ({
                      args: { item },
                      move: EquipItem,
                    })),
                ],
              })),
            },
            {
              title: "Skills",
              description: "Use skills",
              icon: "category",
              children: member.skills.map((skill) => {
                return {
                  args: { skill },
                  move: UseSkill,
                };
              }),
            },
            confirm({
              title: "Disband",
              icon: "close",
              move: DisbandMember,
            }),
          ],
        })),
      },
      {
        title: "Items",
        description: "Use, equip or remove items",
        icon: "shelves",
        component: ItemsScreen,
        children: G.items.map((item) => ({
          title: item.name,
          id: item.id,
          args: { item },
          children: [
            {
              title: "Use",
              icon: "back_hand",
              disabled: item.type != "consumable",
              children: G.members.map((member) => ({
                args: { member },
                move: UseItem,
              })),
            },
            confirm({
              title: "Drop",
              icon: "close",
              disabled: !!equipped(G.members, item.id),
              move: RemoveItem,
            }),
          ],
        })),
      },
      {
        title: "Events",
        description: "History of events",
        icon: "history_edu",
        children: G.events
          .map((lines, turn) => ({
            title: `Day ${turn}`,
            icon: "calendar_month",
            children: lines.map((line, i) => ({
              id: i,
              title: line,
              icon: false,
            })),
          }))
          .reverse(),
      },
    ];
  }
  return tree;
}

export function gameConfig(config: Game) {
  return {
    endIf: ({ G, ctx }) => {
      return ctx.turn >= 10;
    },
    ...config,
  };
}

export function statusBar(state: { G: GameState; ctx: Ctx }) {
  const { G, ctx } = state;
  return [
    { label: "Day", value: ctx.turn },
    { label: "Region", value: G.currentRegionID },
  ];
}
