<script lang="ts">
  import { titleize } from "@engine/utils/string";

  export let name: string;
  export let children: any | any[];
  export let ignoredKeys: string[];

  let entries;
  $: if (Array.isArray(children)) {
    entries = [...children.entries()];
  } else {
    entries = Object.entries(children);
  }
</script>

<strong>{titleize(name)}</strong>
<ul>
  {#each entries as [key, value] (key)}
    {#if !ignoredKeys.includes(key)}
      {#if typeof value == "object" && value}
        <li>
          <svelte:self name={key} children={value} {ignoredKeys} />
        </li>
      {:else}
        <li><strong>{titleize(key)}</strong>: {value ?? "None"}</li>
      {/if}
    {/if}
  {/each}
</ul>
