import { find } from "@engine/entities";
import { initials } from "@engine/utils/string";
import type { Ctx, Game } from "boardgame.io";
import { type Region } from "./entities/region";
import { getAllMoves } from "./moves";
import { type GameState } from "./state";

export const moves = getAllMoves();

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
    {
      label: "Region",
      value: initials(find<Region>(G.regions, G.currentRegionId).name),
    },
  ];
}
