import { ActionManager } from './actions';
import { loadGame } from './save';

export function initialGState() {
    return { count: 0 };
}

export const Game = {
    setup: () => loadGame(),

    moves: new ActionManager().getGameMoves(),

    endIf: ({ G, ctx }) => {
        return G.count >= 10;
    },
};