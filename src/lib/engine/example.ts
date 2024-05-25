import { GameManager } from "./manager";
import { Move } from "./moves";
import type { StatusBarUnit } from "./statusbar";

type GameState = {
  count: number;
};

class CountMove extends Move<GameState> {
  declare args: { n: number };
  commit(state, args) {
    state.G.count += args.n;
  }
}

export function getExampleConfig<GS>() {
  return {
    meta: {
      title: "Black Crown Engine",
      logoPath: "crown.svg",
      sourceURL: "https://github.com/jorgebg/shadows/tree/main/src/lib/engine",
    },
    manager: new GameManager<GameState>({
      moves: [CountMove],
      setupG: () => ({ count: 0 }),
      gameConfig: (config) => ({
        ...config,
        turn: {
          minMoves: 1,
          maxMoves: 1,
        },
        endIf: (state) => state.G.count >= 10,
      }),
      optionTree: (state) => [
        {
          name: "Counter",
          icon: "pin",
          children: [
            {
              name: "Increment",
              icon: "arrow_upward",
              args: { n: 1 },
              move: CountMove,
            },
            {
              name: "Decrement",
              icon: "arrow_downward",
              args: { n: -1 },
              move: CountMove,
            },
          ],
        },
      ],
      statusBar: (state): StatusBarUnit[] => [
        { label: "Turn", value: state.ctx.turn },
        { label: "Count", value: state.G.count },
      ],
    }),
  };
}
