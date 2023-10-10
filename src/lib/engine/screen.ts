import type { _ClientImpl } from "boardgame.io/dist/types/src/client/client";
import { writable } from "svelte/store";
import type { Option } from "./options";

export const selectionIDs = writable<string[]>([]);
export const activeOption = writable<Option>();

export class OptionNavigator {
  selectionIDs: string[];
  constructor(public readonly client: _ClientImpl) {
    selectionIDs.subscribe((ids) => (this.selectionIDs = ids));
  }
  select = (option: Option) => {
    const state = this.client.getState();
    const turn = state.ctx.turn;
    if (option.apply) {
      option.apply(this.client);
      if (typeof option.back == "number") {
        this.back(option.back);
      } else if (state.ctx.turn != turn) {
        this.back(1);
      } else {
        this.back();
      }
    } else {
      selectionIDs.update((ids) => [...ids, option.id]);
    }
  };
  back = (index: number = Math.max(1, this.selectionIDs.length - 1)) => {
    selectionIDs.update((ids) => ids.splice(0, index));
  };
}
