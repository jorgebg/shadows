<script lang="ts">
    import { initialGState } from "./game";
    import { loadGame, saveGame } from "./save";
    import { View, currentView } from "./stores";

    function continueGame() {
        currentView.set(View.Game);
    }

    $: savedGame = loadGame();

    function newGame() {
        saveGame(initialGState());
        currentView.set(View.Game);
    }
</script>

<h2>Where The Shadows Lie</h2>
<div>
    {#if savedGame}
        <p><button on:click={continueGame}> Continue </button></p>
    {/if}
    <p><button on:click={newGame}> New Game </button></p>
</div>

<style>
    button {
        width: 10em;
    }
</style>
