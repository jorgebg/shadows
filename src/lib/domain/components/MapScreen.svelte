<script lang="ts">
    import { travellable } from "@domain/entities/region";
    import { type GameState } from "@domain/state";
    import { selectionIDs } from "@engine/screen";
    import Button, { Label } from "@smui/button";
    import { classMap } from "@smui/common/internal";
    import type { _ClientImpl } from "boardgame.io/dist/types/src/client/client";
    import { type Ctx } from "boardgame.io/src/types";

    export let G: GameState;
    export let ctx: Ctx;
    export let client: _ClientImpl;
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
                $selectionIDs = ["map", `region:${region.id}`];
            }}><Label>{region.id}</Label></Button
        >
    {/each}
</div>

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
