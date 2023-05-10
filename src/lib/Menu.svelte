<script lang="ts">
    import { currentView } from "./stores";
</script>

<h2>Where The Shadows Lie</h2>
<div>
    <button on:click={() => currentView.set("Game")}> Continue </button>
    <button on:click={() => currentView.set("Game")}> New Game </button>
</div>
