import type { Ctx, MoveFn } from "boardgame.io";
import type { EventsAPI } from "boardgame.io/dist/types/src/plugins/plugin-events";

export type SimpleState<GS = any> = { G: GS; ctx: Ctx };
export type State<GS = any> = SimpleState<GS> & { events: EventsAPI };
export type MoveState<GS = any> = Parameters<MoveFn<GS>>[0];
export type MoveReturn<GS = any> = ReturnType<MoveFn<GS>>;
