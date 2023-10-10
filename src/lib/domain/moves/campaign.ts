import { type Character } from "@domain/entities/character";
import { equipped, type EquipmentSlot } from "@domain/entities/equipment";
import { type Item } from "@domain/entities/item";
import { travellable, type Region } from "@domain/entities/region";
import { TaskList, type Task } from "@domain/entities/task";
import { find, remove, type Entity } from "@engine/entities";
import { Move } from "@engine/moves";
import type { State } from "@engine/state";
import { type GameState } from "../state";

function endTurn({ G, ctx, events }: State<GameState>) {
  G.assignments = {};
  events.endTurn();
}

function logEvent({ G, ctx }: State<GameState>, message: string) {
  if (ctx.turn > G.events.length - 1) {
    G.events[ctx.turn] = [];
  }
  G.events[ctx.turn].push(message);
}

function genericLogEvent(state, move: Move, args: Move["args"]) {
  logEvent(
    state,
    `Move: ${move.title} ${Object.values<Entity>(args)
      .map((e) => e.name)
      .join(", ")}`,
  );
}

/** Moves for campaign stage */

export class Travel extends Move<GameState> {
  declare args: { region: Region };
  commit(state, args) {
    const { G } = state;
    state.G.currentRegionID = args.region.id;
    logEvent(state, `Travelled to ${args.region}`);
    endTurn(state);
  }
  validate(state) {
    const { region } = this.args;
    return travellable(state, region);
  }
}

export class AssignTask extends Move<GameState> {
  declare args: {
    task?: Task;
    member: Character;
  };
  commit(state, args) {
    const { G } = state;
    const { task, member } = args;
    if (task) {
      G.assignments[member.id] = task.id;
      const assignedTask = find(TaskList, task.id);
      logEvent(state, `Assigned ${assignedTask.name} to ${member.name}`);
    } else if (member.id in G.assignments) {
      const unassignedTaskId = G.assignments[member.id];
      const unassignedTask = find(TaskList, unassignedTaskId);
      delete G.assignments[member.id];
      logEvent(state, `Unassigned ${unassignedTask.name} from ${member.name}`);
    }
  }

  option(state) {
    const { task, member } = this.args;
    return {
      ...super.option(state),
      icon: member.icon,
      title: `Assign ${member.name}`,
    };
  }

  validate(state) {
    const { task, member } = this.args;
    return !(task && member.id in state.G.assignments);
  }
}

export class UseSkill extends Move<GameState> {
  declare args: {
    member: Character;
  };
  commit(state, args) {
    genericLogEvent(state, this, args);
  }
}

export class EquipItem extends Move<GameState> {
  declare args: {
    item: Item;
    member: Character;
    slot: EquipmentSlot;
  };

  commit(state, args) {
    const { G, ctx } = state;
    const { item, member, slot } = args;
    find<Character>(G.members, member.id).equipment[slot.id] = item.id;
    genericLogEvent(state, this, args);
  }

  option(state) {
    const { item, member } = this.args;
    const equippedBy = equipped(state.G.members, item.id);
    const description = equippedBy ? `Equipped by ${equippedBy.name}` : "";
    return {
      ...super.option(state),
      title: item.name,
      icon: item.name[0],
      description,
    };
  }

  validate(state) {
    const { item, member } = this.args;
    return !equipped(state.G.members, item.id);
  }
}

export class UnequipItem extends Move<GameState> {
  declare args: {
    member: Character;
    slot: EquipmentSlot;
  };

  commit(state, args) {
    const { G, ctx } = state;
    const { member, slot } = args;
    find<Character>(G.members, member.id).equipment[slot.id] = null;
    genericLogEvent(state, this, args);
  }

  validate(state) {
    const { slot, member } = this.args;
    return (
      find<Character>(state.G.members, member.id).equipment[slot.id] !== null
    );
  }
}

export class UseItem extends Move<GameState> {
  declare args: {
    item: Item;
    member: Character;
  };

  commit(state, args) {
    const { item, member } = args;
    if (item.type == "consumable") {
      remove(state.G.items, item.id);
    }
    genericLogEvent(state, this, args);
  }
  option(state) {
    const { item, member } = this.args;
    return {
      ...super.option(state),
      title: member.name,
      icon: member.icon,
      back: 1,
    };
  }
}

export class DisbandMember extends Move<GameState> {
  declare args: {
    member: Character;
  };
  option(state) {
    return { ...super.option(state), back: 1 };
  }
  commit(state, args) {
    const { member } = args;
    remove(state.G.members, member.id);
    if (member.id in state.G.assignments) {
      delete state.G.assignments[member.id];
    }
    genericLogEvent(state, this, args);
  }
  validate(state) {
    return state.G.members.length > 1;
  }
}

export class RemoveItem extends Move<GameState> {
  declare args: {
    item: Item;
  };
  option(state) {
    return { ...super.option(state), back: 1 };
  }
  commit(state, args) {
    const { item } = args;
    remove(state.G.items, item.id);
    genericLogEvent(state, this, args);
  }
  validate(state) {
    const { item } = this.args;
    return !equipped(state.G.members, item.id);
  }
}

export class StartTasks extends Move<GameState> {
  commit(state, args) {
    const { G } = state;
    logEvent(state, `Starting tasks`);
    for (const [memberID, task] of Object.entries(G.assignments)) {
      const member = find(G.members, memberID);
      logEvent(state, `${member.name} is performing ${task}`);
    }
    endTurn(state);
  }
  option(state) {
    return { ...super.option(state), icon: { name: "start", color: "yellow" } };
  }
}
