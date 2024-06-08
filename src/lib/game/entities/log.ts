import type { Entity } from "@engine/repository";
import type { PlayerID } from "boardgame.io";

export interface TurnLog extends Entity {
  number: number;
  log: {
    playerId?: PlayerID;
    message: string;
  }[];
}
