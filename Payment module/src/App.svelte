<script>
  import { onMount, afterUpdate } from 'svelte';
  import { appDataState, stripeState, paymentData, defaultAppState } from "./globals.js"
  import { stripeKeys } from "./constants.js"
  import { screens } from './screens/screenConsts.js'

  export let moduleSettings = null
  
  let Stripe
  let stripeAvailable = false

  let screenHeight

  $appDataState.currentScreen = 'amount'

  $: selectedScreen = screens[$appDataState.currentScreen]

  //Stripe init function
  function initStripe(stripeObj) {
    let currentKey = ($defaultAppState.testMode) ? stripeKeys.test : stripeKeys.live
    $stripeState.stripe = stripeObj(currentKey)
    $stripeState.elements = $stripeState.stripe.elements({
        fonts: [
            {
                cssSrc: "https://fonts.googleapis.com/css?family=Roboto"
            }
        ]
    })
    $stripeState.card = $stripeState.elements.create('card', {
        style: {
        base: {
            iconColor: '@mainColor',
            color: '@fontColor',
            lineHeight: '1.2',
            fontWeight: 200,
            fontSize: '16px',
            letterSpacing: 'normal',
            '::placeholder': {
            color: '@placeholderColor',
            },
        },
        },
        hidePostalCode: true
    })
    stripeAvailable = true
  }

  onMount(() => {
    $defaultAppState = Object.assign({}, $defaultAppState, moduleSettings)
    if(Stripe){
      initStripe(Stripe)
    } else {
      const stripeTicker = setInterval(() => {
        if(window.Stripe){          
          Stripe = window.Stripe
          clearInterval(stripeTicker)
          initStripe(Stripe)
        }        
      })
    }
  })
</script>

<style lang="less">

	/* latin-ext */
    @font-face {
      font-family: 'Lato';
      font-style: normal;
      font-weight: 400;
      src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v15/S6uyw4BMUTPHjxAwXjeu.woff2) format('woff2');
      unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
	}
	/* latin */
	@font-face {
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v15/S6uyw4BMUTPHjx4wXg.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
	}

  //Flags CSS minified
  /*!
  * Generated with CSS Flag Sprite generator (https://www.flag-sprites.com/)
  */:global(.flag){display:inline-block;width:24px;height:25px;margin-top: -2px;background:url('../assets/flags/flags.png') no-repeat;&.flag-ad{background-position:-24px 0}&.flag-ae{background-position:-48px 0}&.flag-af{background-position:-72px 0}&.flag-ag{background-position:-96px 0}&.flag-ai{background-position:-120px 0}&.flag-al{background-position:-144px 0}&.flag-am{background-position:-168px 0}&.flag-an{background-position:-192px 0}&.flag-ao{background-position:-216px 0}&.flag-ar{background-position:-240px 0}&.flag-as{background-position:-264px 0}&.flag-at{background-position:-288px 0}&.flag-au{background-position:-312px 0}&.flag-aw{background-position:-336px 0}&.flag-ax{background-position:-360px 0}&.flag-az{background-position:0 -24px}&.flag-ba{background-position:-24px -24px}&.flag-bb{background-position:-48px -24px}&.flag-bd{background-position:-72px -24px}&.flag-be{background-position:-96px -24px}&.flag-bf{background-position:-120px -24px}&.flag-bg{background-position:-144px -24px}&.flag-bh{background-position:-168px -24px}&.flag-bi{background-position:-192px -24px}&.flag-bj{background-position:-216px -24px}&.flag-bl{background-position:-240px -24px}&.flag-bm{background-position:-264px -24px}&.flag-bn{background-position:-288px -24px}&.flag-bo{background-position:-312px -24px}&.flag-br{background-position:-336px -24px}&.flag-bs{background-position:-360px -24px}&.flag-bt{background-position:0 -48px}&.flag-bw{background-position:-24px -48px}&.flag-by{background-position:-48px -48px}&.flag-bz{background-position:-72px -48px}&.flag-ca{background-position:-96px -48px}&.flag-cd{background-position:-120px -48px}&.flag-cf{background-position:-144px -48px}&.flag-cg{background-position:-168px -48px}&.flag-ch{background-position:-192px -48px}&.flag-ci{background-position:-216px -48px}&.flag-ck{background-position:-240px -48px}&.flag-cl{background-position:-264px -48px}&.flag-cm{background-position:-288px -48px}&.flag-cn{background-position:-312px -48px}&.flag-co{background-position:-336px -48px}&.flag-cr{background-position:-360px -48px}&.flag-cu{background-position:0 -72px}&.flag-cv{background-position:-24px -72px}&.flag-cw{background-position:-48px -72px}&.flag-cy{background-position:-72px -72px}&.flag-cz{background-position:-96px -72px}&.flag-de{background-position:-120px -72px}&.flag-dj{background-position:-144px -72px}&.flag-dk{background-position:-168px -72px}&.flag-dm{background-position:-192px -72px}&.flag-do{background-position:-216px -72px}&.flag-dz{background-position:-240px -72px}&.flag-ec{background-position:-264px -72px}&.flag-ee{background-position:-288px -72px}&.flag-eg{background-position:-312px -72px}&.flag-eh{background-position:-336px -72px}&.flag-er{background-position:-360px -72px}&.flag-es{background-position:0 -96px}&.flag-et{background-position:-24px -96px}&.flag-eu{background-position:-48px -96px}&.flag-fi{background-position:-72px -96px}&.flag-fj{background-position:-96px -96px}&.flag-fk{background-position:-120px -96px}&.flag-fm{background-position:-144px -96px}&.flag-fo{background-position:-168px -96px}&.flag-fr{background-position:-192px -96px}&.flag-ga{background-position:-216px -96px}&.flag-gb{background-position:-240px -96px}&.flag-gd{background-position:-264px -96px}&.flag-ge{background-position:-288px -96px}&.flag-gg{background-position:-312px -96px}&.flag-gh{background-position:-336px -96px}&.flag-gi{background-position:-360px -96px}&.flag-gl{background-position:0 -120px}&.flag-gm{background-position:-24px -120px}&.flag-gn{background-position:-48px -120px}&.flag-gq{background-position:-72px -120px}&.flag-gr{background-position:-96px -120px}&.flag-gs{background-position:-120px -120px}&.flag-gt{background-position:-144px -120px}&.flag-gu{background-position:-168px -120px}&.flag-gw{background-position:-192px -120px}&.flag-gy{background-position:-216px -120px}&.flag-hk{background-position:-240px -120px}&.flag-hn{background-position:-264px -120px}&.flag-hr{background-position:-288px -120px}&.flag-ht{background-position:-312px -120px}&.flag-hu{background-position:-336px -120px}&.flag-ic{background-position:-360px -120px}&.flag-id{background-position:0 -144px}&.flag-ie{background-position:-24px -144px}&.flag-il{background-position:-48px -144px}&.flag-im{background-position:-72px -144px}&.flag-in{background-position:-96px -144px}&.flag-iq{background-position:-120px -144px}&.flag-ir{background-position:-144px -144px}&.flag-is{background-position:-168px -144px}&.flag-it{background-position:-192px -144px}&.flag-je{background-position:-216px -144px}&.flag-jm{background-position:-240px -144px}&.flag-jo{background-position:-264px -144px}&.flag-jp{background-position:-288px -144px}&.flag-ke{background-position:-312px -144px}&.flag-kg{background-position:-336px -144px}&.flag-kh{background-position:-360px -144px}&.flag-ki{background-position:0 -168px}&.flag-km{background-position:-24px -168px}&.flag-kn{background-position:-48px -168px}&.flag-kp{background-position:-72px -168px}&.flag-kr{background-position:-96px -168px}&.flag-kw{background-position:-120px -168px}&.flag-ky{background-position:-144px -168px}&.flag-kz{background-position:-168px -168px}&.flag-la{background-position:-192px -168px}&.flag-lb{background-position:-216px -168px}&.flag-lc{background-position:-240px -168px}&.flag-li{background-position:-264px -168px}&.flag-lk{background-position:-288px -168px}&.flag-lr{background-position:-312px -168px}&.flag-ls{background-position:-336px -168px}&.flag-lt{background-position:-360px -168px}&.flag-lu{background-position:0 -192px}&.flag-lv{background-position:-24px -192px}&.flag-ly{background-position:-48px -192px}&.flag-ma{background-position:-72px -192px}&.flag-mc{background-position:-96px -192px}&.flag-md{background-position:-120px -192px}&.flag-me{background-position:-144px -192px}&.flag-mf{background-position:-168px -192px}&.flag-mg{background-position:-192px -192px}&.flag-mh{background-position:-216px -192px}&.flag-mk{background-position:-240px -192px}&.flag-ml{background-position:-264px -192px}&.flag-mm{background-position:-288px -192px}&.flag-mn{background-position:-312px -192px}&.flag-mo{background-position:-336px -192px}&.flag-mp{background-position:-360px -192px}&.flag-mq{background-position:0 -216px}&.flag-mr{background-position:-24px -216px}&.flag-ms{background-position:-48px -216px}&.flag-mt{background-position:-72px -216px}&.flag-mu{background-position:-96px -216px}&.flag-mv{background-position:-120px -216px}&.flag-mw{background-position:-144px -216px}&.flag-mx{background-position:-168px -216px}&.flag-my{background-position:-192px -216px}&.flag-mz{background-position:-216px -216px}&.flag-na{background-position:-240px -216px}&.flag-nc{background-position:-264px -216px}&.flag-ne{background-position:-288px -216px}&.flag-nf{background-position:-312px -216px}&.flag-ng{background-position:-336px -216px}&.flag-ni{background-position:-360px -216px}&.flag-nl{background-position:0 -240px}&.flag-no{background-position:-24px -240px}&.flag-np{background-position:-48px -240px}&.flag-nr{background-position:-72px -240px}&.flag-nu{background-position:-96px -240px}&.flag-nz{background-position:-120px -240px}&.flag-om{background-position:-144px -240px}&.flag-pa{background-position:-168px -240px}&.flag-pe{background-position:-192px -240px}&.flag-pf{background-position:-216px -240px}&.flag-pg{background-position:-240px -240px}&.flag-ph{background-position:-264px -240px}&.flag-pk{background-position:-288px -240px}&.flag-pl{background-position:-312px -240px}&.flag-pn{background-position:-336px -240px}&.flag-pr{background-position:-360px -240px}&.flag-ps{background-position:0 -264px}&.flag-pt{background-position:-24px -264px}&.flag-pw{background-position:-48px -264px}&.flag-py{background-position:-72px -264px}&.flag-qa{background-position:-96px -264px}&.flag-ro{background-position:-120px -264px}&.flag-rs{background-position:-144px -264px}&.flag-ru{background-position:-168px -264px}&.flag-rw{background-position:-192px -264px}&.flag-sa{background-position:-216px -264px}&.flag-sb{background-position:-240px -264px}&.flag-sc{background-position:-264px -264px}&.flag-sd{background-position:-288px -264px}&.flag-se{background-position:-312px -264px}&.flag-sg{background-position:-336px -264px}&.flag-sh{background-position:-360px -264px}&.flag-si{background-position:0 -288px}&.flag-sk{background-position:-24px -288px}&.flag-sl{background-position:-48px -288px}&.flag-sm{background-position:-72px -288px}&.flag-sn{background-position:-96px -288px}&.flag-so{background-position:-120px -288px}&.flag-sr{background-position:-144px -288px}&.flag-ss{background-position:-168px -288px}&.flag-st{background-position:-192px -288px}&.flag-sv{background-position:-216px -288px}&.flag-sy{background-position:-240px -288px}&.flag-sz{background-position:-264px -288px}&.flag-tc{background-position:-288px -288px}&.flag-td{background-position:-312px -288px}&.flag-tf{background-position:-336px -288px}&.flag-tg{background-position:-360px -288px}&.flag-th{background-position:0 -312px}&.flag-tj{background-position:-24px -312px}&.flag-tk{background-position:-48px -312px}&.flag-tl{background-position:-72px -312px}&.flag-tm{background-position:-96px -312px}&.flag-tn{background-position:-120px -312px}&.flag-to{background-position:-144px -312px}&.flag-tr{background-position:-168px -312px}&.flag-tt{background-position:-192px -312px}&.flag-tv{background-position:-216px -312px}&.flag-tw{background-position:-240px -312px}&.flag-tz{background-position:-264px -312px}&.flag-ua{background-position:-288px -312px}&.flag-ug{background-position:-312px -312px}&.flag-us{background-position:-336px -312px}&.flag-uy{background-position:-360px -312px}&.flag-uz{background-position:0 -336px}&.flag-va{background-position:-24px -336px}&.flag-vc{background-position:-48px -336px}&.flag-ve{background-position:-72px -336px}&.flag-vg{background-position:-96px -336px}&.flag-vi{background-position:-120px -336px}&.flag-vn{background-position:-144px -336px}&.flag-vu{background-position:-168px -336px}&.flag-wf{background-position:-192px -336px}&.flag-ws{background-position:-216px -336px}&.flag-ye{background-position:-240px -336px}&.flag-yt{background-position:-264px -336px}&.flag-za{background-position:-288px -336px}&.flag-zm{background-position:-312px -336px}&.flag-zw{background-position:-336px -336px}}
  //End

  @import './styles/variables.less';
  @import './styles/mixins.less';

	// ****Component styles
	.stripe-form-wrapper-i{
		z-index: 900;
    /* height: 544px; */
    max-width: 940px;
		.stripe-form-i{
      max-width: 432px;
      position: absolute;
      left: 0;
      top: 50%;
      -webkit-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      -o-transform: translateY(-50%);
      transform: translateY(-50%);
      width: 100%;
			.screen-outer-cont-i{
				@media (max-width: 930px){
					max-width: 300px;
				}
				@media (max-width: 767px){
					width: 330px;
				}
				@media (max-width: 374px){
					width: 340px!important;
				}
				font-weight: normal;
				text-transform: uppercase;
				color: @baseFontColor;
				text-align: left;
				max-width: 432px;
				text-align: center;
				margin: 0 auto;
				background-color: @secondaryColor;
				box-sizing: content-box;
        transition: height 0.5s;
        position: relative;
        :global(form){
          display: flex;
          flex-direction: column;
          justify-content: center;
          height: 100%;
        }
			}
		}
    &.stripe-form-banner{
      -webkit-transform: translateX(-470px);
      -ms-transform: translateX(-470px);
      -o-transform: translateX(-470px);
      transform: translateX(-470px);
      position: absolute;
      top: 0;
      left: 50%;
      bottom: 0;
      right: 0;
      @media (max-width: 930px){
        left: 0;
        -webkit-transform: translateX(0);
        -ms-transform: translateX(0);
        -o-transform: translateX(0);
        transform: translateX(0);
      }
      .stripe-form-i{
        @media (max-width: 1004px){
          left: 2rem;
        }
        @media (max-width: 640px){
          left: 1.0625rem;
        }
        @media (max-width: 767px){
          top: 50%;
          left: 50%;
          -webkit-transform: translate(-50%,-50%)!important;
          -ms-transform: translate(-50%,-50%)!important;
          -o-transform: translate(-50%,-50%)!important;
          transform: translate(-50%,-50%)!important;
        }
        @media (max-height: 768px){
          -webkit-transform: translateY(-50%)!important;
          -ms-transform: translateY(-50%)!important;
          -o-transform: translateY(-50%)!important;
          transform: translateY(-50%)!important;
        }
        @media (max-width: 767px){
          -webkit-transform: translate(-50%,-50%)!important;
          -ms-transform: translate(-50%,-50%)!important;
          -o-transform: translate(-50%,-50%)!important;
          transform: translate(-50%,-50%)!important;
        }
      }
    }
    &.stripe-form-embed{
      height: 544px;
      transition: 0.5s height;
      @media (max-width: 660px){
        width: 100%;
      }
      .stripe-form-i{
        left: 50%;
        -webkit-transform: translate(-50%,-50%);
        -ms-transform: translate(-50%,-50%);
        -o-transform: translate(-50%,-50%);
        transform: translate(-50%,-50%);
      }
    }
  }
  
  :global(.stripe-form-wrapper-i){
    :global(h1, h2){
      text-align: left;
      margin-bottom: 0;
      font-size: 1.75rem;
    }
  }
  // ****End

  // ****Global styles
  :global(.stripe-form-wrapper-i){
    :global(.stripe-form-i){
      /* overflow: hidden; */
      transition: height 0.5s;
    }
    input[type="text"], input[type="email"], input[type="number"], textarea{
      width: 100%;
      -webkit-appearance: none;
      -moz-appearance: none;
      box-sizing: border-box;
      color: @fontColor;
      height: 45px;
      border: 1px solid @inputBorderColor;
      border-radius: 0;
      background-color: @inputBorderColor;
      padding: 12px 9px;
      margin: 0;
      box-sizing: border-box;
      &.error{
        border-color: @mainColor;
      }
      &:focus{
        outline: none;
      }
      @media (max-width: 767px){
        height: 38px;
        padding: 9px;
      }
      @media (max-width: 374px){
        //font-size: 0.85em;
        height: 34px;
        padding: 7px;
      }
    }
    input[type="submit"]{
      width: 100%;
      border: none;
      margin-bottom: 0;
      background-color: @mainColor;
      color: @secondaryColor;
      text-transform: uppercase;
      font-weight: 800;
      letter-spacing: 1px;
      font-size: 1.75rem;
      padding: .45em 1em .25em;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      -webkit-appearance: none;
      -moz-appearance: none;
      font-family: @dropdownFontFamily;
      border-radius: 0;
      &:focus{
        outline: none;
      }
    }
    input[type="checkbox"], input[type="radio"]{
        margin-right: 5px;
    }
    :global(p){
      margin: 0 0 1.2em;
      line-height: 1.3em;

    }
    :global(div, p){
      text-transform: initial;
      text-align: left;
      &:focus{
        outline: none;
      }
    }
    :global(a){
      color: @fontColor;
      &:hover{
        text-decoration: none;
      }
    }
    :global(.stripe-form-i .selectContainer){
      border-radius: 0;
      padding: 0 9px;
      height: 45px;
      box-sizing: border-box;
      border-color: @inputBorderColor;
      background-color: @inputBorderColor;
      //Arrow
      &:before{
        content: '';
        border-color: #888 transparent transparent transparent;
        border-style: solid;
        border-width: 5px 4px 0 4px;
        height: 0;
        right: 12px;
        margin-left: -4px;
        margin-top: -2px;
        position: absolute;
        top: 50%;
        width: 0;
      }
      &.focused, &:hover{
        border-color: @inputBorderColor;
      }
      input{
        box-sizing: border-box;
        padding: 0 9px !important;
      }
      .indicator{
        svg{
          display: none;
        }
      }
      .selectedItem{
        overflow: hidden;
        + :global(div){
          width: 100% !important;
          min-width: 100%;
        }
      }
      .listContainer{
        box-shadow: none;
        border-radius: 0;
        border: 1px solid @inputBorderColor;
        margin: -7px 1px -7px -1px;
        .listItem .item{
          border-radius: 0;
          padding: 0 9px;
        }
      }
    }
  }
  //****End
</style>

<svelte:head>
	<script type="text/javascript" src='https://www.google.com/recaptcha/api.js?render=6LeQ0cAUAAAAAByJquA53j58inQTrHAk-b_QOpOH' ></script>
</svelte:head>

<div class="stripe-form-wrapper-i" class:stripe-form-banner={!$defaultAppState.embed} class:stripe-form-embed={$defaultAppState.embed} style={($defaultAppState.embed) ? `height: ${screenHeight || 0}px` : ''}>
  <div class="stripe-form-i">
    <div class="screen-outer-cont-i">
      {#if stripeAvailable}
          <svelte:component this={selectedScreen.component} screenObj={selectedScreen} bind:screenHeight={screenHeight}/>
      {/if}
    </div>
  </div>
</div>


