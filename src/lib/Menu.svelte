<script lang="ts">
    import { View, currentView, savedGame } from "./stores";

    function continueGame() {
        currentView.set(View.Game);
    }

    function newGame() {
        savedGame.set({ turn: 0 });
        currentView.set(View.Game);
    }
</script>

<h2>Where The Shadows Lie</h2>
<div>
    {#if $savedGame}
        <button on:click={continueGame}> Continue </button>
    {/if}
    <button on:click={newGame}> New Game </button>
</div>
