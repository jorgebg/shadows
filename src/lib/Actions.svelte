<script lang="ts">
    export let actions;
    console.log(actions);
</script>

<div>
    {#each actions as action}
        <div>
            {#if action.move}
                <button on:click={action.move}>{action.name}</button>
            {:else}
                {action.name}
            {/if}

            {#if action.children}
                <svelte:self actions={action.children} />
            {/if}
        </div>
    {/each}
</div>
