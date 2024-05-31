import type { Ctx, PlayerID } from "boardgame.io";
import type { VisualEntity } from "./base";
import type { Location } from "./region";

export interface Band extends VisualEntity {
  playerId: PlayerID;
  locationId: Location["id"];
}

export function getPlayerBandId(id: PlayerID) {
  return `bands#${id}`;
}

export function getCurrentPlayerBandId(ctx: Ctx) {
  return getPlayerBandId(ctx.currentPlayer);
}
