<script lang="ts">
  import { type GameState } from "@domain/state";
  import GenericInfo from "@engine/components/GenericScreen.svelte";
  import { activeOption } from "@engine/screen";
  import type { _ClientImpl } from "boardgame.io/dist/types/src/client/client";
  import { type Ctx } from "boardgame.io/src/types";

  export let G: GameState;
  export let ctx: Ctx;
  export let client: _ClientImpl;

  $: args = $activeOption?.args;
</script>

<GenericInfo {G} {ctx} {client} />
