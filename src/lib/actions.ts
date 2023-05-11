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


export interface ActionTree {
    name: string,
    move?: CallableFunction,
    children?: ActionTree[],
}

export function getAvailableActionsTree(client): ActionTree[] {
    return [
        {
            name: "Increment 1-5", children: [
                { name: "Increment 1", move: () => client.moves.Increment(1) },
                { name: "Increment 2", move: () => client.moves.Increment(2) },
                { name: "Increment 3", move: () => client.moves.Increment(3) },
                { name: "Increment 4", move: () => client.moves.Increment(4) },
                { name: "Increment 5", move: () => client.moves.Increment(5) },
            ]
        },
        {
            name: "Increment 6-10", children: [
                { name: "Increment 6", move: () => client.moves.Increment(6) },
                { name: "Increment 7", move: () => client.moves.Increment(7) },
                { name: "Increment 8", move: () => client.moves.Increment(8) },
                { name: "Increment 9", move: () => client.moves.Increment(9) },
                { name: "Increment 10", move: () => client.moves.Increment(10) },
            ]
        },
    ]
}