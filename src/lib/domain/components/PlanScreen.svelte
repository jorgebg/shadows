<script lang="ts">
  import { TaskTypeMap, type Task } from "@domain/entities/task";
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
      {@const member = get(G, task.characterId)}
      {@const type = TaskTypeMap[task.typeId]}
      <Row>
        <Cell>{member.name}:<br />{type.name}</Cell>
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
