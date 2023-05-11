<script lang="ts">
    import { loadGame, saveGame } from "./save";
    import { View, currentView } from "./stores";

    function continueGame() {
        currentView.set(View.Game);
    }

    $: savedGame = loadGame();

    function newGame() {
        saveGame({ count: 0 });
        currentView.set(View.Game);
    }
</script>

<h2>Where The Shadows Lie</h2>
<div>
    {#if savedGame}
        <button on:click={continueGame}> Continue </button>
    {/if}
    <button on:click={newGame}> New Game </button>
</div>
