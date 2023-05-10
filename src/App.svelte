<script lang="ts">
  import Menu from "./lib/Menu.svelte";
  import Game from "./lib/Game.svelte";
  import { currentView } from "./lib/stores";
</script>

<main>
  <h1>
    <img
      src="warlord-helmet.svg"
      alt="Where The Shadows Lie"
      title="Where The Shadows Lie"
    />
  </h1>
  <div>
    {#if $currentView == "Menu"}
      <Menu />
    {/if}
    {#if $currentView == "Game"}
      <Game />
    {/if}
  </div>
</main>

<style>
  main {
    text-align: center;
  }
  h1 img {
    max-height: 1em;
  }
</style>
