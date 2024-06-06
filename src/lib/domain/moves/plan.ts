import { getCurrentBand } from "@domain/entities/bands";
import {
  getCurrentBandMembers,
  type Character,
} from "@domain/entities/character";
import { type Item } from "@domain/entities/item";
import { LocationTypeMap, type Location } from "@domain/entities/location";
import type { TurnLog } from "@domain/entities/log";
import { getWorldMap, travellable } from "@domain/entities/map";
import { getCurrentBandRegion, type Region } from "@domain/entities/region";
import {
  TaskTypeMap,
  getTaskId,
  type Task,
  type TaskType,
} from "@domain/entities/task";
import { equipment, equipped, type EquipmentSlot } from "@domain/equipment";
import { Move } from "@engine/moves";
import {
  create,
  filter,
  get,
  getAll,
  getOrCreate,
  remove,
  removeAll,
  type Entity,
} from "@engine/repository";
import type { State } from "@engine/state";
import { type GameState } from "../state";

function endTurn({ G, ctx, events }: State<GameState>) {
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

/** Moves for plan stage */

export class Travel extends Move<GameState> {
  declare args: { region: Region };
  commit(state, args) {
    getCurrentBand(state).cell = args.region.cell;
    removeAll<Task>(state.G, "tasks");
    logMessage(state, `Travelled to ${args.region.name}`);
    endTurn(state);
  }
  validate(state) {
    const { region } = this.args;
    return travellable(
      getWorldMap(state.G),
      getCurrentBandRegion(state).cell,
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
    const taskId = getTaskId(member);
    if (task && location) {
      create<Task>(G, taskId, {
        typeId: task.id,
        locationId: location.id,
        characterId: member.id,
      });
      logMessage(
        state,
        `Assigned ${task.name} to ${member.name} in ${location.name}`,
      );
    } else {
      const removed = remove<Task>(G, taskId);
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
    return !(
      task &&
      filter<Task>(state.G, "tasks", { characterId: member.id }).length > 0
    );
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
    remove(state.G, getTaskId(member));
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
    for (const task of getAll<Task>(G, "tasks")) {
      const taskType = TaskTypeMap[task.typeId];
      const member = get<Character>(G, task.characterId);
      const location = get<Location>(G, task.locationId);
      const locationType = LocationTypeMap[location.typeId];
      logMessage(
        state,
        `${member.name} is performing ${taskType.name} in ${locationType.name}`,
      );
    }
    endTurn(state);
  }
  option(state) {
    return { ...super.option(state), icon: { name: "start", color: "yellow" } };
  }
}
