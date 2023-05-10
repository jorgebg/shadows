<script lang="ts">
  import { View, currentView, savedGame } from "./stores";

  const nextTurn = () => {
    savedGame.update((G) => {
      console.log(G);
      G.turn += 1;
      return G;
    });
  };
</script>

<p>Turn is {$savedGame.turn}</p>
<button on:click={nextTurn}> Next Turn </button>
<button on:click={() => currentView.set(View.Menu)}> Exit </button>
