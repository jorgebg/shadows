<script lang="ts">
  import { get, query } from "@engine/repository";
  import type { Character } from "@game/entities/character";
  import {
    LocationTypeMap,
    type Location,
    type LocationType,
  } from "@game/entities/location";
  import { TaskTypeMap, type Task, type TaskType } from "@game/entities/task";
  import { AssignTask } from "@game/moves/plan";
  import { type GameState } from "@game/state";
  import DataTable, { Body, Cell, Head, Row } from "@smui/data-table";
  import IconButton from "@smui/icon-button";
  import type { _ClientImpl } from "boardgame.io/dist/types/src/client/client";
  import { type Ctx } from "boardgame.io/src/types";

  export let G: GameState;
  export let ctx: Ctx;
  export let client: _ClientImpl;

  $: tasks = query<Task>(G, "tasks");
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
