<script lang="ts">
    import { activeOption } from "@engine/screen";
    import Card from "@smui/card";
    import type { _ClientImpl } from "boardgame.io/dist/types/src/client/client";
    import { type Ctx } from "boardgame.io/src/types";
    import NestedList from "./utils/NestedList.svelte";

    export let G: any;
    export let ctx: Ctx;
    export let client: _ClientImpl;

    $: args = $activeOption?.args;

    const ignoredKeys = ["id", "icon"];
</script>

{#if args}
    {#each Object.entries(args) as [name, arg] (name)}
        <Card padded>
            <NestedList {name} children={arg} {ignoredKeys} />
        </Card>
    {/each}
{:else}Select an option{/if}
