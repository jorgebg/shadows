<script lang="ts">
  import Menu from "./lib/Menu.svelte";
  import Game from "./lib/Game.svelte";
  import { View, currentView } from "./lib/stores";
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
    {#if $currentView == View.Menu}
      <Menu />
    {/if}
    {#if $currentView == View.Game}
      <Game />
    {/if}
  </div>
</main>
