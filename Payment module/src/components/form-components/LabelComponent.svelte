<script>
    import { slide } from "svelte/transition"

    export let forName = ''
    export let className
    export let id = ''
    export let isTransitioned = false
</script>

<style lang="less">
    label{
        margin: 0 0 4px;
        position: relative;
        display: block;
        &.max-donation{
            font-size: 13px;
            line-height: 1.2em;
            display: block;
            margin-bottom: 6px;
        }
    }
</style>

{#if isTransitioned}
    <label transition:slide for={forName} class={className}>
        <slot></slot>
    </label>
{:else}
    <label for={forName} class={className}>
        <slot></slot>
    </label>
{/if}