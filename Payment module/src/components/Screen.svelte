<script>
    //Screen wrapper to handle animations on module screen change
    import { appDataState } from "./../globals.js"
    import { screenOrders } from './../screens/screensOrderConsts.js'

    export let currScreenObj
    export let screenHeight

    function overflow(node, {}){
        return {
			duration: 300,
			css: (t, u) => {
                let position
                if(currScreenObj.screenOrder === $appDataState.prevScreen){
                    position = (currScreenObj.screenOrder > screenOrders[$appDataState.currentScreen].screenOrder) ? 'top' : 'bottom'
                } else {
                    position = (currScreenObj.screenOrder > $appDataState.prevScreen) ? 'top' : 'bottom'
                }
                
                return `${(position === 'top') ? 'clip-path: inset(0% 0% 0% '+u*110+'%);' : 'clip-path: inset(0% '+u*110+'% 0% 0%);' } position: absolute; transform:translateY(-50%); top: 0; left: 0; z-index: 999;`
			}
		};
    }
</script>

<style lang="less">
    @import './../styles/variables.less';
    .screen-outer{
        width: 100%;
    }
    .screen{
        padding: 2em 1.6em;
        background-color: @secondaryColor;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        width: 100%;
        border: 1px solid lighten(@baseFontColor, 70%);
        @media (max-width: 767px){
          padding: 2em 1.6em 3em;
        }
        @media (max-width: 548px){
          padding: 1em;
        }
    }
</style>

<div class="screen-outer" in:overflow out:overflow bind:offsetHeight={screenHeight}>
    <div class="{`${currScreenObj.class} screen`}" >
        <slot />
    </div>
</div>