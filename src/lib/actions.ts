import { type Ctx } from 'boardgame.io/src/types';
import { Client } from "boardgame.io/client";
import { GameState } from "./state";

export class ActionManager {
    get actions() { return [Increment] }
    getGameMoves() {
        const moves = {}
        for (const cls of this.actions) {
            const action = new cls();
            moves[action.name] = action.asMove()
        }
        return moves
    }
}

export abstract class BaseAction {
    undoable = true
    abstract commit({ G, ctx }: { G: GameState, ctx: Ctx }, ...args: any[]): void
    get name() {
        return this.constructor.name;
    }
    asMove() {
        return {
            move: this.commit,
            undoable: this.undoable,
        }
    }
}

class Increment extends BaseAction {
    commit({ G, ctx }, n = 1) {
        G.count += n
    }
}
