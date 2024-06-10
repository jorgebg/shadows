import { EntityManager } from "@engine/repository";
import type { SimpleState } from "@engine/state";
import type { PlayerID } from "boardgame.io";
import type { VisualEntity } from "./base";
import type { Point } from "./map";
import { Regions, type Region } from "./region";

export interface Band extends VisualEntity {
  playerId: PlayerID;
  cell: Point;
}

export interface BandRelations {
  region: Region;
}

export function getCurrentBand({ G, ctx }: SimpleState): Band {
  return new Bands(G).get({ playerId: ctx.currentPlayer });
}
export class Bands extends EntityManager<Band, BandRelations> {
  ref(band) {
    if (typeof band.playerId !== undefined) {
      return `player:${band.playerId}`;
    }
  }
  related(band: Band) {
    const related = super.related(band);
    if (band.cell) {
      related.region = new Regions(this.R).get({ cell: band.cell });
    }
    return related;
  }
}
