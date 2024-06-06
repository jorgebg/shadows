import { getCurrentPlayerBand } from "@domain/entities/bands";
import {
  getCurrentBandMembers,
  type Character,
} from "@domain/entities/character";
import {
  equipment,
  equipped,
  type EquipmentSlot,
} from "@domain/entities/equipment";
import type { TurnLog } from "@domain/entities/event";
import { type Item } from "@domain/entities/item";
import {
  getCurrentPlayerRegion,
  getWorldMap,
  type Location,
  type Region,
} from "@domain/entities/location";
import { travellable } from "@domain/entities/map";
import { TaskTypeMap, type Task, type TaskType } from "@domain/entities/task";
import { type Entity } from "@engine/entities";
import { Move } from "@engine/moves";
import { EntityId, create, get, getOrCreate, remove } from "@engine/repository";
import type { State } from "@engine/state";
import { type GameState } from "../state";

function endTurn({ G, ctx, events }: State<GameState>) {
  G.assignments = {};
  events.endTurn();
}

function logMessage({ G, ctx }: State<GameState>, message: string) {
  const id = `log#${ctx.turn}`;
  let eventLog = getOrCreate<TurnLog>(G, id, { turn: ctx.turn, log: [] });
  eventLog.log.push({ playerId: ctx.currentPlayer, message });
}

function logGenericMove(state, move: Move, args: Move["args"]) {
  logMessage(
    state,
    `Move: ${move.name} ${Object.values<Entity>(args)
      .map((e) => e.name)
      .join(", ")}`,
  );
}

/** Moves for campaign stage */

export class Travel extends Move<GameState> {
  declare args: { region: Region };
  commit(state, args) {
    getCurrentPlayerBand(state).cell = args.region.cell;
    logMessage(state, `Travelled to ${args.region.name}`);
    endTurn(state);
  }
  validate(state) {
    const { region } = this.args;
    return travellable(
      getWorldMap(state.G),
      getCurrentPlayerRegion(state).cell,
      region.cell,
    );
  }
}

export class AssignTask extends Move<GameState> {
  declare args: {
    task?: TaskType;
    location?: Location;
    member: Character;
  };
  commit(state, args) {
    const { G } = state;
    const { task, location, member } = args;
    const charRef = new EntityId(member.id).ref;
    if (task) {
      create<Task>(G, `tasks#${charRef}`, {
        typeId: task.id,
        locationId: location ? location.id : member.locationId,
        characterId: member.id,
      });
      logMessage(state, `Assigned ${task.name} to ${member.name}`);
    } else {
      const removed = remove<Task>(G, `tasks#${charRef}`);
      const unassignedTask = TaskTypeMap[removed.typeId];
      logMessage(
        state,
        `Unassigned ${unassignedTask.name} from ${member.name}`,
      );
    }
  }

  option(state) {
    const { task, member } = this.args;
    return {
      ...super.option(state),
      icon: member.icon,
      name: `Assign ${member.name}`,
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
    logGenericMove(state, this, args);
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
    get<Character>(G, member.id).equipment[slot.id] = item.id;
    logGenericMove(state, this, args);
  }

  option(state) {
    const { item, member } = this.args;
    const equippedBy = equipped(getCurrentBandMembers(state), item.id);
    const description = equippedBy ? `Equipped by ${equippedBy.name}` : "";
    return {
      ...super.option(state),
      name: item.name,
      icon: item.name[0],
      description,
    };
  }

  validate(state) {
    const { item, member } = this.args;
    return !equipped(getCurrentBandMembers(state), item.id);
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
    get<Character>(G, member.id).equipment[slot.id] = null;
    logGenericMove(state, this, args);
  }

  validate(state) {
    const { slot, member } = this.args;
    return equipment(state.G, member, slot) !== null;
  }
  option(state) {
    const { member, slot } = this.args;
    const item = equipment(state.G, member, slot);
    return {
      ...super.option(state),
      name: item ? `Unequip ${item.name}` : "Unequip",
    };
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
      remove(state.G, item.id);
    }
    logGenericMove(state, this, args);
  }
  option(state) {
    const { item, member } = this.args;
    return {
      ...super.option(state),
      name: member.name,
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
    remove(state.G, member.id);
    if (member.id in state.G.assignments) {
      delete state.G.assignments[member.id];
    }
    logGenericMove(state, this, args);
  }
  validate(state) {
    return getCurrentBandMembers(state).length > 1;
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
    remove(state.G, item.id);
    logGenericMove(state, this, args);
  }
  validate(state) {
    const { item } = this.args;
    return !equipped(getCurrentBandMembers(state), item.id);
  }
}

export class StartTasks extends Move<GameState> {
  commit(state, args) {
    const { G } = state;
    logMessage(state, `Starting plan`);
    for (const [memberID, task] of Object.entries(G.assignments)) {
      const member = get<Character>(G, memberID);
      logMessage(state, `${member.name} is performing ${task}`);
    }
    endTurn(state);
  }
  option(state) {
    return { ...super.option(state), icon: { name: "start", color: "yellow" } };
  }
}
