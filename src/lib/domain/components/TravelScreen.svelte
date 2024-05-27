<script lang="ts">
  import {
    getRegionIcons,
    travellable,
    type Region,
  } from "@domain/entities/region";
  import { type GameState } from "@domain/state";
  import NestedList from "@engine/components/utils/NestedList.svelte";
  import { find } from "@engine/entities";
  import { OptionID } from "@engine/options";
  import { selectionIDs } from "@engine/screen";
  import Button, { Label } from "@smui/button";
  import Card from "@smui/card";
  import { classMap } from "@smui/common/internal";
  import type { _ClientImpl } from "boardgame.io/dist/types/src/client/client";
  import { type Ctx } from "boardgame.io/src/types";
  import { derived } from "svelte/store";

  export let G: GameState;
  export let ctx: Ctx;
  export let client: _ClientImpl;

  const selectedRegion = derived(
    selectionIDs,
    ($ids) => {
      if ($ids.length > 1) {
        const regionID = $ids[1].split(":")[1];
        return find<Region>(G.regions, regionID);
      } else {
        return undefined;
      }
    },
    undefined,
  );
</script>

<div class="region-map">
  {#each G.regions as region (region.id)}
    <Button
      color={G.currentRegionID == region.id ? "secondary" : "primary"}
      class={classMap({
        region: true,
        travellable: travellable({ G, ctx }, region),
      })}
      variant="outlined"
      on:click={(e) => {
        $selectionIDs = ["travel", OptionID("region", { region })];
      }}><Label>{getRegionIcons(region)}</Label></Button
    >
  {/each}
</div>

{#if $selectedRegion}
  <Card padded>
    <NestedList
      name="Locations"
      children={$selectedRegion.locations}
      ignoredKeys={["id", "region"]}
    />
  </Card>
{/if}

<style lang="scss">
  .region-map {
    width: 100%;
    display: grid;
    grid-auto-rows: 1fr;
    grid-template-columns: 33% 33% 33%;
    grid-column-gap: 10px;
    grid-row-gap: 10px;

    :global(.region) {
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: width/height;
    }
    :global(.region.travellable) {
      border-color: var(
        --mdc-outlined-button-outline-color,
        rgba(255, 255, 255, 0.4)
      );
    }
  }
</style>
