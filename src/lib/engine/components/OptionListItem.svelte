<script lang="ts">
  import type { Option } from "@engine/options";
  import { classMap } from "@smui/common/internal";
  import {
    Graphic,
    Item,
    Meta,
    PrimaryText,
    SecondaryText,
    Text,
  } from "@smui/list";
  import Icon from "./Icon.svelte";

  export let option: Option;
  export let action: (CustomEvent) => void = undefined;
  export let keybind: string = undefined;

  if (!option.children && !option.apply) {
    action = null;
  }
</script>

{#if !option.hidden}
  <Item
    on:SMUI:action={action}
    disabled={!!option.disabled}
    class={classMap({
      "mdc-elevation--z2": true,
      "option-list-item": true,
    })}
    data-keybind={keybind}
  >
    {#if option.icon !== false}
      <Graphic class="option-list-item-icon">
        <Icon icon={option.icon} name={option.name}></Icon>
      </Graphic>
    {/if}
    {#if option.description}
      <Text class="option-list-item-long-text">
        <PrimaryText>{option.name}</PrimaryText>
        <SecondaryText>
          {option.description}
        </SecondaryText>
      </Text>
    {:else}
      <Text class="option-list-item-short-text">
        {option.name}
      </Text>
    {/if}
    <slot name="meta">
      {#if option.children}
        <Meta
          ><span class="material-symbols-outlined"> chevron_right </span></Meta
        >
      {/if}
    </slot>
  </Item>
{/if}

<style lang="scss">
  :global(.option-list-item) {
    margin-bottom: 5px;
    height: auto !important;
    min-height: 64px;

    :global(*) {
      text-overflow: initial;
      white-space: initial;
      overflow: visible;
    }

    :global(.option-list-item-short-text) {
      align-self: auto !important;
    }
    @media screen and (max-width: 599px) {
      :global(.option-list-item-icon) {
        margin-right: 16px;
      }
    }
  }
</style>
