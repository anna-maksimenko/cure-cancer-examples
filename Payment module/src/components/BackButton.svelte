<script>
    export let backHandler
    export let disclaimerVisible = false
</script>
<style lang="less">
@import './../styles/mixins.less';
@import './../styles/variables.less';
    .back-cont{
        font-size: 0;
        margin-top: .75rem;
        .privacy-info{
            text-align: left;
            margin-bottom: 4px;
            > p{
                font-size: .8125rem;
                line-height: 1.5em;
                margin: 0;
                a{
                    color: @mainColor;
                }
            }
        }
    }
    .back-btn-wrapper{
        font-size: 1rem;
        text-align: center;
    }
    .back-btn{
        display: block;
        color: #777;
        @media (max-width: 930px){
            font-size: 0.875rem;
        }
        @media (max-width: 767px){
            font-size: 0.75rem;
        }
    }
    .back-btn:before{
        .squarespace-font; 
        content: "\e000";
    }
</style>

<div class="back-cont">
    {#if disclaimerVisible}
        <div class="privacy-info">
            <p>By donating, you agree to our <a href="https://www.curecancer.com.au/privacy-policy" target="_blank">privacy policy</a></p>
        </div>
    {/if}
    <div class="back-btn-wrapper">
        <a class="back-btn" href="/" on:click|preventDefault="{backHandler}">Back</a>
    </div>
</div>