import type { StatusBarUnit } from "@engine/statusbar";
import { initials } from "@engine/utils/string";
import type { Ctx, Game } from "boardgame.io";
import { getCurrentBand } from "./entities/bands";
import { CardinalPointsGrid } from "./entities/location";
import { getCurrentBandRegion } from "./entities/region";
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

export function statusBar(state: { G: GameState; ctx: Ctx }): StatusBarUnit[] {
  const { G, ctx } = state;
  const band = getCurrentBand(state);
  const units: StatusBarUnit[] = [
    { label: { icon: "calendar_today" }, value: ctx.turn },
    {
      label: { icon: "map" },
      value:
        getCurrentBandRegion(state).name +
        " (" +
        initials(CardinalPointsGrid[band.cell.y][band.cell.x]) +
        ")",
    },
  ];
  if (ctx.numPlayers > 1) {
    units.push({
      label: { icon: "person" },
      value: ctx.currentPlayer,
    });
  }
  return units;
}
