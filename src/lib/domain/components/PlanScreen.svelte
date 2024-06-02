<script lang="ts">
  import { TaskList } from "@domain/entities/task";
  import { AssignTask } from "@domain/moves/campaign";
  import { type GameState } from "@domain/state";
  import { find } from "@engine/entities";
  import { get } from "@engine/repository";
  import DataTable, { Body, Cell, Head, Row } from "@smui/data-table";
  import IconButton from "@smui/icon-button";
  import type { _ClientImpl } from "boardgame.io/dist/types/src/client/client";
  import { type Ctx } from "boardgame.io/src/types";

  export let G: GameState;
  export let ctx: Ctx;
  export let client: _ClientImpl;
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
    {#each Object.entries(G.assignments) as [memberId, taskId] (memberId)}
      {@const member = get(G, memberId)}
      {@const task = find(TaskList, taskId)}
      <Row>
        <Cell>{member.name}:<br />{task.name}</Cell>
        <Cell
          ><IconButton
            on:click={() => new AssignTask({ task: null, member }).send(client)}
            class="material-symbols-outlined"
            >close
          </IconButton></Cell
        >
      </Row>
    {/each}
  </Body>
</DataTable>
