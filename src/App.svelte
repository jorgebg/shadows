<script lang="ts">
  import Menu from "./lib/Menu.svelte";
  import Game from "./lib/Game.svelte";
  import { View, currentView } from "./lib/stores";
</script>

<header>
  <h1>
    <img
      src="warlord-helmet.svg"
      alt="Where The Shadows Lie"
      title="Where The Shadows Lie"
    />
  </h1>
</header>
<main>
  <div>
    {#if $currentView == View.Menu}
      <Menu />
    {/if}
    {#if $currentView == View.Game}
      <Game />
    {/if}
  </div>
</main>

<footer>
  <p>
    Source: <a href="https://github.com/jorgebg/shadows"
      >github.com/jorgebg/shadows</a
    >
  </p>
</footer>
