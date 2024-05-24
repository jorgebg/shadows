import { find } from "@engine/entities";
import { confirm, type Option } from "@engine/options";
import type { Ctx } from "boardgame.io";
import BandScreen from "./components/BandScreen.svelte";
import ItemsScreen from "./components/ItemsScreen.svelte";
import PlanScreen from "./components/PlanScreen.svelte";
import TravelScreen from "./components/TravelScreen.svelte";
import { power } from "./entities/character";
import { EquipmentSlotList, equipped } from "./entities/equipment";
import { getRegionIcons } from "./entities/region";
import { TaskList } from "./entities/task";
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

export function optionTree(state: { G: GameState; ctx: Ctx }): Option[] {
  const { G, ctx } = state;
  let tree = [];
  if (!ctx.gameover) {
    tree = [
      {
        title: "Plan",
        description: "Assign tasks for the day",
        icon: "map",
        component: PlanScreen,
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
        title: "Travel",
        description: "Map of regions",
        icon: "signpost",
        component: TravelScreen,
        children: G.regions.map((region) => ({
          id: `region:${region.id}`,
          title: region.name,
          description: getRegionIcons(region),
          args: { region },
          hidden: true,
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
        title: "Band",
        description: "Manage members",
        icon: "groups",
        component: BandScreen,
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
                icon:
                  find(G.items, member.equipment[slot.id])?.icon || slot.icon,
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
                      icon: item.icon,
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
          icon: item.icon,
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
