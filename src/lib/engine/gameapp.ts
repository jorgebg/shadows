import type { GameManager } from "./manager";

export interface GameAppConfig {
  meta: {
    title: string;
    logoPath: string;
    sourceURL?: string;
  };
  manager: GameManager<any>;
}
