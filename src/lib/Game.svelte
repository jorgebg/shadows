<script lang="ts">
  import { onDestroy } from "svelte";
  import { Client } from "boardgame.io/client";
  import { View, currentView } from "./stores";
  import { saveGame } from "./save";
  import { Game } from "./game";

  let client = Client({ game: Game });
  client.start();

  let state = client.getState();
  $: G = state.G;
  $: ctx = state.ctx;

  const update = (newState) => {
    state = newState;
    saveGame(newState.G);
  };

  client.subscribe((state) => update(state));
  onDestroy(() => client.stop());
</script>

<p>Count is {G.count}</p>
<p>
  {#if ctx.gameover}Game over{/if}
</p>
<button on:click={() => client.moves.Increment(1)}> Increment </button>
<button on:click={() => currentView.set(View.Menu)}> Exit </button>
