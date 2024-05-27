<script lang="ts">
  import { type Icon } from "@engine/icons";
  import { cssColor } from "@engine/utils/css";
  import * as icons from "@icons";

  export let icon: Icon;
  export let name: String;
  let clazz = "material-symbols-outlined";
  export { clazz as class };
</script>

{#if typeof icon === "object"}
  {#if icon.path}
    <img src={icon.path} alt={icon.name} />
  {:else if icon.component}
    <svelte:component this={icons[icon.component]} {...icon.props} />
  {:else if icon.name}
    <span class={clazz} style:color={cssColor(icon.color)}>{icon.name}</span>
  {/if}
{:else if typeof icon === "string"}
  <span class={clazz}>{icon}</span>
{:else}
  {name
    .split(/[\s-_]+/)
    .map((n) => n[0])
    .splice(0, 3)
    .join("")}
{/if}
