<script lang="ts">
  import { getGameAppConfig } from "@domain/config";
  import GameApp from "@engine/components/GameApp.svelte";
  import "./app.scss";
</script>

<GameApp config={getGameAppConfig()} />
<!-- <GameApp config={getExampleConfig()} /> -->
