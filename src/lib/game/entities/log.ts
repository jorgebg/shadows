import { EntityManager, type Entity } from "@engine/repository";
import type { PlayerID } from "boardgame.io";

export interface TurnLog extends Entity {
  number: number;
  log: {
    playerId?: PlayerID;
    message: string;
  }[];
}

export class TurnLogs extends EntityManager<TurnLog> {
  get namespace(): string {
    return "logs";
  }
  ref(obj) {
    return obj.number;
  }
}
