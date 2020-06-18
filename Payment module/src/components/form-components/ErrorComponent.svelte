<script>
    import { fade } from 'svelte/transition'

    export let message

    export let visible = true

    export let shakeError = false

    let errorNode

    function closeHandler(){
        visible = false
    }
</script>

<style type="text/less">
    .error{
        display: inline-block;
        position: absolute;
        left: 0;
        top: 100%;
        margin-top: 5px;
        background-color: @mainColor;
        color: @secondaryColor;
        padding: 12px 9px;
        z-index: 99;
        width: 100%;
        box-sizing: border-box;
        border: 1px solid @mainColor;
        font-size: 16px;
        box-shadow: 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,.05);
        @media (max-width: 767px){
            padding: 9px;
        }
        @media (max-width: 374px){
            padding: 7px;
        }
        &:after{
            content: '';
            position: absolute;
            left: 10px;
            top: -30px;
            border: 20px solid transparent;
            border-bottom: 20px solid @mainColor;
        }
    }
    .inner-error-cont{
        position: relative;
    }
    .close{
        position: absolute;
        top: 0;
        right: 2px;
        &:before{
            content: 'x';
            font-family: 'squarespace-ui-font';
            font-style: normal;
            font-weight: normal;
            -webkit-font-smoothing: antialiased;
            display: inline-block;
            vertical-align: middle;
            speak: none;
            content: "\e02e";
        }
    }

    .shake{
        transform-origin: 30px -10px;
        animation-name: shake;
        animation-duration: 1s;
        animation-iteration-count: 1;
        animation-timing-function: ease-in;
    }

    @keyframes shake {
        0% {transform: none}
        5% {transform: rotateZ(-5deg)}
        10% {transform: rotateZ(3deg)}
        15% {transform: rotateZ(-4deg)}
        20% {transform: rotateZ(2deg)}
        25% {transform: rotateZ(-2deg)}
        30% {transform: rotateZ(1deg)}
        35% {transform: none}
    }
</style>

{#if visible}
    <div class="error" class:shake={shakeError} transition:fade bind:this={errorNode}>
        <div class="inner-error-cont">
            <span>{message}</span>
            <div class="close" on:click={closeHandler}></div>
        </div>
    </div>
{/if}

