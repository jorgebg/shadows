<script lang="ts">
  import type { GameAppConfig } from "@engine/gameapp";
  import { cssColor } from "@engine/utils/css";
  import Button, {
    Icon as ButtonIcon,
    Label as ButtonLabel,
  } from "@smui/button";
  import LayoutGrid, { Cell } from "@smui/layout-grid";
  import List from "@smui/list";
  import Paper, { Content } from "@smui/paper";
  import Tab, { Icon as TabIcon, Label as TabLabel } from "@smui/tab";
  import TabBar from "@smui/tab-bar";
  import type { _ClientImpl } from "boardgame.io/dist/types/src/client/client";
  import { derived } from "svelte/store";
  import { OptionNavigator, activeOption, selectionIDs } from "../screen";
  import OptionListItem from "./OptionListItem.svelte";

  export let config: GameAppConfig;
  export let client: _ClientImpl;

  const { manager, meta } = config;
  const nav = new OptionNavigator(client);

  const state = derived(client, (state) => state, client.getState());

  let initialOptionTree = manager.getOptionTree($state);
  $selectionIDs = [initialOptionTree[0].id];
  $: optionTree = manager.getOptionTree($state);
  $: screenIDs = optionTree.map((tab) => tab.id);
  $: activeScreenID = screenIDs.find(
    (screenID) => screenID == $selectionIDs[0],
  );
  $: activeScreen = optionTree.getById(activeScreenID);
  $: $activeOption = optionTree.path($selectionIDs);
  $: infoComponent = $activeOption?.component || activeScreen?.component;
  $: if (import.meta.env.DEV) {
    console.log($activeOption);
  }
</script>

<div>
  <TabBar tabs={screenIDs} let:tab={screenID} bind:active={activeScreenID}>
    {@const screen = optionTree.getById(screenID)}
    <Tab
      tab={screenID}
      on:click={(event) => ($selectionIDs = [screenID])}
      data-keybind={screen.name[0].toLowerCase()}
      style={`width: ${100 / optionTree.length}%`}
      class="screen-tab"
    >
      {#if typeof screen.icon === "object"}
        <TabIcon
          class="material-symbols-outlined"
          style="color: {cssColor(screen.icon.color)}"
          >{screen.icon.name}</TabIcon
        >
      {:else}
        <TabIcon class="material-symbols-outlined">{screen.name[0]}</TabIcon>
      {/if}
      <TabLabel class="screen-tab-label">{screen.name}</TabLabel>
    </Tab>
  </TabBar>

  <Paper variant="unelevated" class="screen">
    <!-- <pre class="status">Selection IDs: {JSON.stringify($selectionIDs)}</pre> -->
    {#if $activeOption}
      <Content>
        <LayoutGrid class="screen-layout-grid" fixedColumnWidth>
          {@const nPanels = infoComponent ? 2 : 1}
          {@const spanDevices = {
            desktop: 8 / nPanels,
            tablet: 8 / nPanels,
            phone: 4 / nPanels,
          }}
          <Cell {spanDevices}>
            <div class="screen-panel screen-options">
              <div class="screen-options-header">
                <div>
                  <div class="mdc-typography--overline option-selection-path">
                    {$activeOption.breadcrumbs.map((o) => o.name).join(" / ")}
                  </div>
                  <div class="mdc-typography--subtitle2">
                    {$activeOption.header || ""}
                  </div>
                </div>
                {#if $selectionIDs.length > 1}
                  <Button
                    on:click={(e) => nav.back()}
                    color="secondary"
                    variant="outlined"
                    data-keybind="b"
                  >
                    <ButtonIcon class="material-symbols-outlined"
                      >arrow_back</ButtonIcon
                    >
                    <ButtonLabel>Back</ButtonLabel>
                  </Button>
                {/if}
              </div>
              <List class="screen-options-list" twoLine>
                {#if $activeOption.children.length > 0}
                  {#each $activeOption.children as option, index (option.id)}
                    <OptionListItem
                      {option}
                      action={() => nav.select(option)}
                      keybind={`${(index + 1) % 10}`}
                    />
                  {/each}
                {:else}
                  No options are available
                {/if}
              </List>
            </div>
          </Cell>
          {#if infoComponent}
            <Cell {spanDevices}>
              <div class="screen-panel screen-info">
                <svelte:component
                  this={infoComponent}
                  G={$state.G}
                  ctx={$state.ctx}
                  {client}
                />
              </div>
            </Cell>
          {/if}
        </LayoutGrid>
      </Content>
    {/if}
  </Paper>
</div>

<style lang="scss">
  :global(.screen-tab) {
    min-width: 24px;
    padding: 0;
  }
  @media screen and (max-width: 599px) {
    :global(.screen-tab-label) {
      display: none;
    }
    :global(.screen-layout-grid) {
      padding: 5px;
    }
  }
  :global(.screen) {
    padding: 5px;
  }

  .screen-panel {
    max-width: calc(var(--game-width) / 2);
    margin: auto;
  }

  .screen-options {
    .screen-options-header {
      display: flex;
      align-items: stretch;
      justify-content: space-between;
    }
    :global(.screen-options-list) {
    }
  }
  :global(.option-selection-path) {
    line-height: normal;
  }
</style>
