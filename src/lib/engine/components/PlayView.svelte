<script lang="ts">
  import { deleteMatch } from "@engine/save";
  import { View, activeView } from "@engine/views";
  import Banner, { Label as BannerLabel } from "@smui/banner";
  import Button, { Icon, Label } from "@smui/button";
  import IconButton from "@smui/icon-button";
  import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
  import { onDestroy } from "svelte";
  import { derived } from "svelte/store";
  import type { GameAppConfig } from "../gameapp";
  import Screen from "./Screens.svelte";

  export let config: GameAppConfig;
  let { manager, meta } = config;
  let client = manager.getNewClient();
  client.start();
  onDestroy(() => client.stop());

  const state = derived(client, (state) => state, client.getState());
  $: if ($state.ctx.gameover) {
    deleteMatch();
  }
</script>

<TopAppBar variant="static" dense={true}>
  <Row>
    <Section>
      <IconButton disabled>
        <img
          class="top-app-bar-icon"
          src={meta.logoPath}
          alt="Logo"
          title="{meta.title} logo"
        /></IconButton
      >
      {#each manager.statusBar($state) as unit}
        {#if typeof unit === "string"}
          <Title>{unit}</Title>
        {:else if typeof unit.label === "string"}
          <Title>{unit.label}: {unit.value}</Title>
        {:else}
          <Button disabled>
            <Icon class="material-symbols-outlined">{unit.label.icon}</Icon>
            <Label>{unit.value}</Label>
          </Button>
        {/if}
      {/each}
    </Section>

    <Section align="end" toolbar>
      <IconButton on:click={() => activeView.set(View.MainMenu)}>
        <span class="material-symbols-outlined">logout</span>
      </IconButton></Section
    >
  </Row>
</TopAppBar>

{#if $state.ctx.gameover}
  <Banner open fixed centered>
    <BannerLabel slot="label">Game Over</BannerLabel>
    <Button
      slot="actions"
      on:click={() => activeView.set(View.MainMenu)}
      color="primary">Go to menu</Button
    >
  </Banner>{/if}

<Screen {config} {client} />

<style lang="scss">
  .top-app-bar-icon {
    filter: invert(100%);
  }
</style>
