<script>
    export let nextHandler
</script>

<style lang="less">
    .next-btn input{
        @media (max-width: 767px){
            font-size: 1.2rem;
        }
    }
</style>

<div class="next-btn">
    <input type="submit" value="Next" on:click|preventDefault="{nextHandler}"/>
</div>