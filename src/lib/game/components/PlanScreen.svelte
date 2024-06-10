<script lang="ts">
  import { Tasks } from "@game/entities/task";
  import { AssignTask } from "@game/moves/plan";
  import { type GameState } from "@game/state";
  import DataTable, { Body, Cell, Head, Row } from "@smui/data-table";
  import IconButton from "@smui/icon-button";
  import type { _ClientImpl } from "boardgame.io/dist/types/src/client/client";
  import { type Ctx } from "boardgame.io/src/types";

  export let G: GameState;
  export let ctx: Ctx;
  export let client: _ClientImpl;

  $: tasks = new Tasks(G).query();
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
      {@const related = new Tasks(G).related(task)}
      <Row>
        <Cell
          >{related.character.name}:<br />{related.type.name}
          {related.location.name}</Cell
        >
        <Cell
          ><IconButton
            on:click={() =>
              new AssignTask({
                task: undefined,
                member: related.character,
              }).send(client)}
            class="material-symbols-outlined"
            >close
          </IconButton></Cell
        >
      </Row>
    {/each}
  </Body>
</DataTable>
