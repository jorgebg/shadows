<script lang="ts">
  import type { Character } from "@domain/entities/character";
  import {
    LocationTypeMap,
    type Location,
    type LocationType,
  } from "@domain/entities/location";
  import { TaskTypeMap, type Task, type TaskType } from "@domain/entities/task";
  import { AssignTask } from "@domain/moves/campaign";
  import { type GameState } from "@domain/state";
  import { get, getAll } from "@engine/repository";
  import DataTable, { Body, Cell, Head, Row } from "@smui/data-table";
  import IconButton from "@smui/icon-button";
  import type { _ClientImpl } from "boardgame.io/dist/types/src/client/client";
  import { type Ctx } from "boardgame.io/src/types";

  export let G: GameState;
  export let ctx: Ctx;
  export let client: _ClientImpl;

  $: tasks = getAll<Task>(G, "tasks");
  $: console.log(tasks);

  function getMember(characterId: Character["id"]): Character {
    return get<Character>(G, characterId);
  }
  function getTaskType(typeId: Task["typeId"]): TaskType {
    return TaskTypeMap[typeId];
  }

  function getLocationType(locationId: Location["id"]): LocationType {
    const location = get<Location>(G, locationId);
    return LocationTypeMap[location.typeId];
  }
</script>

<DataTable table$aria-label="Assignments list">
  <Head>
    <Row>
      <Cell>Tasks</Cell>
      <Cell />
      <!-- <Cell /> -->
    </Row>
  </Head>
  <Body>
    {#each tasks as task (task.id)}
      {@const member = getMember(task.characterId)}
      {@const taskType = getTaskType(task.typeId)}
      {@const locationType = getLocationType(task.locationId)}
      <Row>
        <Cell>{member.name}:<br />{taskType.name} {locationType.name}</Cell>
        <Cell
          ><IconButton
            on:click={() =>
              new AssignTask({ task: undefined, member }).send(client)}
            class="material-symbols-outlined"
            >close
          </IconButton></Cell
        >
      </Row>
    {/each}
  </Body>
</DataTable>
