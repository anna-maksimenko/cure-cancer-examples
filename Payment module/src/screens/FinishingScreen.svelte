<script>
    import Screen from '../components/Screen.svelte'
    import { defaultAppState } from '../globals.js'

    export let screenObj
    export let screenHeight
</script>

<style lang="less">
    .text-cont{
        min-height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-family: @dropdownFontFamily;
        font-size: 22px;
        text-align: center
    }
</style>

<Screen currScreenObj={screenObj} bind:screenHeight={screenHeight}>
    <div class="text-cont">
        {$defaultAppState.finishingScreenText}
    </div>
</Screen>