import type { AiEnumerate, Ctx, Game } from "boardgame.io";
import { Client } from "boardgame.io/client";
import { Debug } from "boardgame.io/debug";
import type {
  ClientOpts,
  _ClientImpl,
} from "boardgame.io/dist/types/src/client/client";
import { Local } from "boardgame.io/multiplayer";
import type { Move } from "./moves";
import { OptionTree, type Option } from "./options";
import { loadMatch } from "./save";
import type { SimpleState } from "./state";
import type { StatusBarUnit } from "./statusbar";

export abstract class DefaultGameManager<GS = {}> {
  public readonly moves: (typeof Move<GS>)[];
  public readonly setupG = (): GS => ({}) as GS;
  public readonly optionTree = (state: SimpleState<GS>): Option[] => [];
  public readonly statusBar = (state: SimpleState<GS>): StatusBarUnit[] => [];
  public readonly gameConfig = (config: Game): Game => ({ ...config });
}

export class GameManager<GS = {}> extends DefaultGameManager<GS> {
  constructor(config: Partial<DefaultGameManager<GS>>) {
    super();
    Object.assign(this, config);
  }

  getClientConfig(): ClientOpts {
    return {
      game: this.getGameConfig(),
      multiplayer: Local({
        persist: true,
      }),
      matchID: loadMatch(),
      playerID: "0",
      numPlayers: 1,
      debug: { impl: Debug, collapseOnLoad: true, hideToggleButton: true },
    };
  }

  getNewClient(): _ClientImpl {
    const config = this.getClientConfig();
    return Client(config);
  }

  getOptionTree(state: SimpleState<GS>): OptionTree {
    if (state.ctx.gameover) {
      return new OptionTree();
    } else {
      const tree = new OptionTree(...this.optionTree(state));
      tree.setup(state);
      return tree;
    }
  }

  enumerateAIMoves(G: GS, ctx: Ctx): AiEnumerate {
    const optionsTree = this.getOptionTree({ G, ctx });
    const options = optionsTree.getLeaves();
    const aiEnumerate = [];
    for (let option of options) {
      if (option.move) {
        const { move, args } = option;
        aiEnumerate.push({ move, args });
      }
    }
    return aiEnumerate;
  }

  getGameConfig(): Game {
    const moves = {};
    for (const move of this.moves) {
      moves[move.name] = new move().toLongFormMove();
    }
    return this.gameConfig({
      setup: this.setupG.bind(this),
      moves,
      ai: {
        enumerate: this.enumerateAIMoves.bind(this),
      },
    });
  }
}
