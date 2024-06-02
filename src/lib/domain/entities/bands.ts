import type { Ctx, PlayerID } from "boardgame.io";
import type { VisualEntity } from "./base";
import type { Point } from "./map";

export interface Band extends VisualEntity {
  playerId: PlayerID;
  cell: Point;
  // locationId: Location["id"];
}

export function getPlayerBandId(id: PlayerID) {
  return `bands#player${id}`;
}

export function getCurrentPlayerBandId(ctx: Ctx) {
  return getPlayerBandId(ctx.currentPlayer);
}
