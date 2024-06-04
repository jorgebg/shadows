import type { Ctx, Game } from "boardgame.io";
import { getCurrentPlayerRegion } from "./entities/location";
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
      value: getCurrentPlayerRegion(state).name,
    },
  ];
}
