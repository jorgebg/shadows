<script lang="ts">
    import { bindKeys, unBindKeys } from "@engine/utils/keybind";
    import { onDestroy, onMount } from "svelte";
    import type { GameAppConfig } from "../gameapp";
    import { View, activeView } from "../views";
    import MainMenuView from "./MainMenuView.svelte";
    import PlayView from "./PlayView.svelte";

    export let config: GameAppConfig;
    const { meta, manager } = config;

    onDestroy(() => unBindKeys());
    onMount(async () => bindKeys());
</script>

<svelte:head>
    <title>{meta.title}</title>
    <link rel="icon" type="image/svg+xml" href={meta.logoPath} />
</svelte:head>

{#if $activeView == View.MainMenu}
    <MainMenuView {config} />
{/if}
{#if $activeView == View.Play}
    <PlayView {config} />
{/if}
