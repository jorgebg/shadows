<script lang="ts">
  import { onDestroy } from "svelte";
  import { Client } from "boardgame.io/client";
  import { View, currentView } from "./stores";
  import { loadGame, saveGame } from "./save";

  let client = Client({
    game: {
      setup: () => loadGame(),

      moves: {
        increment: ({ G, playerID }) => {
          G.count += 1;
        },
      },
    },
  });
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
<button on:click={client.moves.increment}> Increment </button>
<button on:click={() => currentView.set(View.Menu)}> Exit </button>
