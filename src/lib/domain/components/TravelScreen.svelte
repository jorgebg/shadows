<script lang="ts">
  import { getCurrentBand } from "@domain/entities/bands";
  import {
    getCellIcons,
    getCellLocations,
    getWorldMap,
    type Region,
  } from "@domain/entities/location";
  import { travellable } from "@domain/entities/map";
  import { type GameState } from "@domain/state";
  import NestedList from "@engine/components/utils/NestedList.svelte";
  import { OptionID } from "@engine/options";
  import { get, getAll } from "@engine/repository";
  import { selectionIDs } from "@engine/screen";
  import Button, { Label } from "@smui/button";
  import Card from "@smui/card";
  import { classMap } from "@smui/common/internal";
  import type { _ClientImpl } from "boardgame.io/dist/types/src/client/client";
  import { type Ctx } from "boardgame.io/src/types";
  import equals from "fast-deep-equal";
  import { derived } from "svelte/store";

  export let G: GameState;
  export let ctx: Ctx;
  export let client: _ClientImpl;

  const selectedRegion = derived(
    selectionIDs,
    ($optionIds) => {
      if ($optionIds.length > 1) {
        const regionId = OptionID.parse(...$optionIds).args.get("region");
        return get<Region>(G, regionId);
      } else {
        return undefined;
      }
    },
    undefined,
  );

  function getRegions(G: GameState): Region[] {
    return getAll<Region>(G, "regions");
  }
  $: band = getCurrentBand({ G, ctx });
</script>

<div class="region-map">
  {#each getRegions(G) as region (region.id)}
    <Button
      color={equals(band.cell, region.cell) ? "secondary" : "primary"}
      class={classMap({
        region: true,
        travellable: travellable(getWorldMap(G), band.cell, region.cell),
      })}
      variant="outlined"
      on:click={(e) => {
        $selectionIDs = ["travel", OptionID.build("region", { region })];
      }}><Label>{getCellIcons(G, region.cell)}</Label></Button
    >
  {/each}
</div>

{#if $selectedRegion}
  <Card padded>
    <NestedList
      name="Locations"
      children={getCellLocations(G, $selectedRegion.cell)}
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
