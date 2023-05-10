<script lang="ts">
  import { currentView } from "./stores";

  let gameState = { turn: 0 };
  const nextTurn = () => {
    gameState.turn += 1;
  };
</script>

<p>Turn is {gameState.turn}</p>
<button on:click={nextTurn}> Next Turn </button>
<button on:click={() => currentView.set("Menu")}> Exit </button>
