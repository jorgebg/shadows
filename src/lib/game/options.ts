import { confirm, type Option } from "@engine/options";
import { titleize } from "@engine/utils/string";
import type { Ctx } from "boardgame.io";
import BandScreen from "./components/BandScreen.svelte";
import ItemsScreen from "./components/ItemsScreen.svelte";
import PlanScreen from "./components/PlanScreen.svelte";
import TravelScreen from "./components/TravelScreen.svelte";
import { getCurrentBand } from "./entities/bands";
import { getCurrentBandMembers, power } from "./entities/character";
import { Items } from "./entities/item";
import { getCellIcons, Locations } from "./entities/location";
import { TurnLogs } from "./entities/log";
import { Regions } from "./entities/region";
import { TaskTypeMap } from "./entities/task";
import { EquipmentSlotList, equipped } from "./equipment";
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
} from "./moves/plan";
import { type GameState } from "./state";

export function optionTree(state: { G: GameState; ctx: Ctx }): Option[] {
  const { G, ctx } = state;
  let tree = [];
  const band = getCurrentBand(state);
  if (!ctx.gameover) {
    tree = [
      {
        code: "plan",
        description: "Assign tasks for the day",
        icon: "map",
        component: PlanScreen,
        children: [
          ...new Locations(G).query({ cell: band.cell }).map((location) => ({
            ...new Locations(G).related(location).type,
            code: "plan",
            args: { location },
            children: Object.values(TaskTypeMap).map((task) => ({
              code: task.id,
              description: task.description,
              icon: task.icon,
              args: { task },
              children: getCurrentBandMembers(state).map((member) => ({
                args: { member },
                move: AssignTask,
              })),
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
        children: new Regions(G).query().map((region) => ({
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
        children: getCurrentBandMembers(state).map((member) => ({
          code: "select_member",
          name: member.name,
          description: `${titleize(member.race)} (${power(member)}) [${
            Object.values(member.equipment)
              .filter((id) => !!id)
              .map((id) => new Items(G).get({ id }).name)
              .join(", ") || "no equipment"
          }]`,
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
                  new Items(G).get({ id: member.equipment[slot.id] })?.icon ||
                  slot.icon,
                name: slot.name,
                args: { slot },
                description:
                  new Items(G).get({ id: member.equipment[slot.id] })?.name ||
                  "<empty>",
                children: [
                  ...(new Items(G).get({ id: member.equipment[slot.id] })
                    ? [
                        {
                          code: "unequip",
                          icon: "close",
                          move: UnequipItem,
                        },
                      ]
                    : []),
                  ...new Items(G)
                    .query(
                      (item) =>
                        item.bandId == band.id &&
                        item.type == slot.type &&
                        equipped(getCurrentBandMembers(state), item.id)?.id !=
                          member.id,
                    )
                    .map((item) => ({
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
        children: new Items(G)
          .query({ bandId: band.id })
          .sort((item) => (item.type === "consumable" ? -1 : 1))
          .map((item) => ({
            code: "select_item",
            name: item.name,
            category: item.type === "consumable" ? "Consumable" : "Equipment",
            icon: item.icon,
            args: { item },
            children: [
              {
                code: "use",
                icon: "back_hand",
                disabled: item.type != "consumable",
                children: getCurrentBandMembers(state).map((member) => ({
                  args: { member },
                  move: UseItem,
                })),
              },
              (() => {
                const equippedBy = equipped(
                  getCurrentBandMembers(state),
                  item.id,
                );
                return confirm({
                  code: "drop",
                  icon: "close",
                  disabled: !!equippedBy,
                  description: equippedBy
                    ? `Equipped by ${equippedBy.name}`
                    : "",
                  move: RemoveItem,
                });
              })(),
            ],
          })),
      },
      {
        code: "log",
        description: "History of events",
        icon: "history_edu",
        children: new TurnLogs(G)
          .query()
          .sort((a, b) => (a.number > b.number ? 1 : -1))
          .reduce((logs, turn) => {
            logs.push(
              ...turn.log.map((line, i) => ({
                id: `day_${turn.number}_${i}`,
                name: line.message,
                icon: false,
                category: `Day ${turn.number}`,
              })),
            );
            return logs;
          }, [])
          .reverse(),
      },
    ];
  }
  return tree;
}
