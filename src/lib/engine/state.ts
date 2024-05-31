import type { Ctx, MoveFn } from "boardgame.io";
import type { EventsAPI } from "boardgame.io/src/plugins/plugin-events";
import type { RandomAPI } from "boardgame.io/src/plugins/random/random";

export type SimpleState<GS = any> = { G: GS; ctx: Ctx };
export type State<GS = any> = SimpleState<GS> & {
  events: EventsAPI;
  random: RandomAPI;
};
export type MoveState<GS = any> = Parameters<MoveFn<GS>>[0];
export type MoveReturn<GS = any> = ReturnType<MoveFn<GS>>;
