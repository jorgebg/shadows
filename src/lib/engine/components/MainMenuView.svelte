<script lang="ts">
    import { loadMatch, newMatch } from "@engine/save";
    import { View, activeView } from "@engine/views";
    import Button, { Label } from "@smui/button";
    import Card, { Content } from "@smui/card";
    import type { GameAppConfig } from "../gameapp";

    export let config: GameAppConfig;
    const { meta, manager } = config;

    $: savedMatchID = loadMatch();

    function clickContinueGame(): void {
        activeView.set(View.Play);
    }

    function clickNewGame() {
        newMatch();
        activeView.set(View.Play);
    }
</script>

<main class="main-menu">
    <Card padded>
        <Content>
            <header>
                <img src={meta.logoPath} alt={meta.title} title={meta.title} />

                <h2 class="mdc-typography--headline5">Where The Shadows Lie</h2>
            </header>
            <nav>
                {#if savedMatchID}
                    <Button
                        on:click={clickContinueGame}
                        variant="raised"
                        tabindex={1}
                        autofocus
                        data-keybind="c"
                    >
                        <Label>Continue</Label>
                    </Button>
                {/if}
                <Button
                    on:click={clickNewGame}
                    variant="raised"
                    tabindex={2}
                    autofocus
                    data-keybind="n"
                >
                    <Label>New Game</Label>
                </Button>
            </nav>
        </Content>
    </Card>
    <footer>
        {#if meta.sourceURL}
            <Button href={meta.sourceURL} target="_blank" color="secondary">
                <Label>Source</Label>
            </Button>
        {/if}
    </footer>
</main>

<style lang="scss">
    main {
        width: 360px;
        margin: auto;
        padding: 1em;

        :global(button) {
            padding: 24px;
            font-size: large;
        }
    }

    header {
        text-align: center;

        img {
            max-height: 4em;
            filter: invert(100%);
        }
    }

    nav {
        text-align: center;
    }

    footer {
        text-align: center;
        padding: 1em;
    }
</style>
