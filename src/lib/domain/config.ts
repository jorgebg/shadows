import type { GameAppConfig } from "@engine/gameapp";
import { GameManager } from "@engine/manager";
import { gameConfig, moves, statusBar } from "./game";
import { optionTree } from "./options";
import { setupG } from "./setup";
import type { GameState } from "./state";

export function getGameAppConfig(): GameAppConfig {
  return {
    meta: {
      title: "Where The Shadows Lie",
      logoPath: "warlord-helmet.svg",
      sourceURL: "https://github.com/jorgebg/shadows",
    },
    manager: new GameManager<GameState>({
      moves,
      setupG,
      optionTree,
      statusBar,
      gameConfig,
    }),
  };
}
