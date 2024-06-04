import { confirm, type Option } from "@engine/options";
import { filter, get, getAll } from "@engine/repository";
import { titleize } from "@engine/utils/string";
import type { Ctx } from "boardgame.io";
import BandScreen from "./components/BandScreen.svelte";
import ItemsScreen from "./components/ItemsScreen.svelte";
import PlanScreen from "./components/PlanScreen.svelte";
import TravelScreen from "./components/TravelScreen.svelte";
import { getCurrentPlayerBandId } from "./entities/bands";
import { getCurrentPlayerBandMembers, power } from "./entities/character";
import { EquipmentSlotList, equipped } from "./entities/equipment";
import type { TurnLog } from "./entities/event";
import type { Item } from "./entities/item";
import { getCellIcons, type Region } from "./entities/location";
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
  const bandId = getCurrentPlayerBandId(ctx);
  if (!ctx.gameover) {
    tree = [
      {
        code: "plan",
        description: "Assign tasks for the day",
        icon: "map",
        component: PlanScreen,
        children: [
          ...TaskList.map((task) => ({
            code: task.id,
            description: task.description,
            icon: task.icon,
            args: { task },
            children: getCurrentPlayerBandMembers(state).map((member) => ({
              args: { member },
              move: AssignTask,
            })),
          })),
          confirm({
            code: "start",
            icon: { name: "start", color: "yellow" },
            move: StartTasks,
          }),
        ],
      },
      {
        code: "travel",
        description: "Map of regions",
        icon: "signpost",
        component: TravelScreen,
        children: getAll<Region>(G, "regions").map((region) => ({
          code: "region",
          name: region.name,
          description: getCellIcons(G, region.cell),
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
        code: "band",
        description: "Manage members",
        icon: "groups",
        component: BandScreen,
        children: getCurrentPlayerBandMembers(state).map((member) => ({
          code: "select_member",
          name: member.name,
          description: `${titleize(member.race)}, Power ${power(member)}, ${
            Object.values(member.equipment)
              .filter((i) => i)
              .map((i) => get<Item>(G, i).name)
              .join(", ") || "no equipment"
          }`,
          icon: member.icon,
          args: { member },
          children: [
            {
              code: "equipment",
              description: "Manage equipped items",
              icon: "accessibility",
              children: EquipmentSlotList.map((slot) => ({
                ...slot,
                icon:
                  get<Item>(G, member.equipment[slot.id])?.icon || slot.icon,
                name: slot.name,
                args: { slot },
                description:
                  get<Item>(G, member.equipment[slot.id])?.name || "<empty>",
                children: [
                  ...(get<Item>(G, member.equipment[slot.id])
                    ? [
                        {
                          code: "unequip",
                          icon: "close",
                          move: UnequipItem,
                        },
                      ]
                    : []),
                  ...filter<Item>(
                    G,
                    "items",
                    (item) =>
                      item.bandId == bandId &&
                      item.type == slot.type &&
                      equipped(getCurrentPlayerBandMembers(state), item.id)
                        ?.id != member.id,
                  ).map((item) => ({
                    icon: item.icon,
                    args: { item },
                    move: EquipItem,
                  })),
                ],
              })),
            },
            {
              code: "skills",
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
              code: "disband",
              icon: "close",
              move: DisbandMember,
            }),
          ],
        })),
      },
      {
        code: "items",
        description: "Use, equip or remove items",
        icon: "shelves",
        component: ItemsScreen,
        children: filter<Item>(G, "items", { bandId }).map((item) => ({
          code: "select_item",
          name: item.name,
          icon: item.icon,
          args: { item },
          children: [
            {
              code: "use",
              icon: "back_hand",
              disabled: item.type != "consumable",
              children: getCurrentPlayerBandMembers(state).map((member) => ({
                args: { member },
                move: UseItem,
              })),
            },
            (() => {
              const equippedBy = equipped(
                getCurrentPlayerBandMembers(state),
                item.id,
              );
              return confirm({
                code: "drop",
                icon: "close",
                disabled: !!equippedBy,
                description: equippedBy ? `Equipped by ${equippedBy.name}` : "",
                move: RemoveItem,
              });
            })(),
          ],
        })),
      },
      {
        code: "events",
        description: "History of events",
        icon: "history_edu",
        children: getAll<TurnLog>(G, "log")
          .map((eventLog) => ({
            code: `day_${eventLog.turn}`,
            icon: "calendar_month",
            children: eventLog.log.map((line, i) => ({
              code: i,
              name: line.message,
              icon: false,
            })),
          }))
          .reverse(),
      },
    ];
  }
  return tree;
}
