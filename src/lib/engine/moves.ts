import type { LongFormMove } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import type { _ClientImpl } from "boardgame.io/dist/types/src/client/client";
import type { Entity } from "./entities";
import type { Option } from "./options";
import type { MoveReturn, MoveState, SimpleState } from "./state";
import { repr } from "./utils/string";

export class Move<GS = any> {
  constructor(public readonly args: { [key: string]: Entity | any } = {}) {}

  commit(state: MoveState<GS>, args: (typeof this)["args"]): MoveReturn<GS> {
    state.events.pass();
  }
  toLongFormMove(): LongFormMove {
    return { move: this.commit.bind(this) };
  }

  option(state: SimpleState<GS>): Option {
    const apply = (client) => {
      client.moves[this.name](this.args);
    };
    return {
      title: this.title,
      apply: apply,
      disabled: !this.validate(state),
    };
  }

  send(client: _ClientImpl): MoveReturn<GS> {
    if (this.validate(client.getState())) {
      return client.moves[this.name](this.args);
    } else {
      return INVALID_MOVE;
    }
  }

  validate(state: SimpleState<GS>): boolean {
    return true;
  }

  toString(): string {
    return this.name;
  }

  get name(): string {
    return this.constructor.name;
  }
  get title(): string {
    const tokens = this.name.replace(/([A-Z])/g, " $1");
    let title = (tokens.charAt(0).toUpperCase() + tokens.slice(1)).trim();
    if (this.args) {
      title += " ";
      title += Object.values(this.args)
        .map((arg) => repr(arg))
        .join(" ");
    }
    return title;
  }
}
