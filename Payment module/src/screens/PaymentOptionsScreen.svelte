<script>
    import { appDataState, stripeState, paymentData, defaultAppState } from "../globals.js"

    import Screen from '../components/Screen.svelte'
    import BackButton from '../components/BackButton.svelte'
    import LabelComponent from './../components/form-components/LabelComponent.svelte'
    import ErrorComponent from './../components/form-components/ErrorComponent.svelte'

    export let screenObj
    export let screenHeight

    let error

    //Maximize donation checkbox handler
    function maximizeHandler(){
        $appDataState.amountToPay = ($appDataState.maximizeDonation) ? $appDataState.currentAmount*100*1.02 : $appDataState.currentAmount*100
        $stripeState.paymentRequest.update({
          total: {
            label: 'CureCancer Australia Donation',
            amount: $appDataState.amountToPay
          }
        })
    }

    //Screen flip functions
    function backHandler(){
        if($appDataState.inHonourDonation){
            $appDataState.currentScreen = 'to-honour'
        } else {
            $appDataState.currentScreen = 'amount'
        }
        $appDataState.prevScreen = screenObj.screenOrder
    }

    function payByCardHandler(){
        $stripeState.expressCheckoutSelected = false
        $appDataState.currentScreen = 'payment-data'
        $appDataState.prevScreen = screenObj.screenOrder
    }

    function expressPayHandler(){
        $stripeState.paymentRequest.show()
        $stripeState.paymentRequest.once('token', expressPayTokenHandler);
    }

    //Express payment token handler and screen flip functions
    function expressPayTokenHandler(result) {
        if (result.error) {
            console.log('Token error')
            error = result.error.message
            result.complete('fail')
        } else {
            error = null
            $stripeState.cardToken = result.token
            result.complete('success')
            $stripeState.expressCheckoutSelected = true
            $paymentData.payerName = result.payerName.split(' ')[0]
            $paymentData.payerLastName = result.payerName.split(' ')[1],
            $paymentData.payerEmail = result.payerEmail;
            if(result.token.card){
                $paymentData.payerCity = (result.token.card.address_city) ? result.token.card.address_city : ''
                $paymentData.payerAddress = ((result.token.card.address_line1) ? result.token.card.address_line1 : '')+((result.token.card.address_line2) ? ' '+result.token.card.address_line2 : '')
                $paymentData.payerZIP = (result.token.card.address_zip) ? result.token.card.address_zip : ''
                $paymentData.payerState = (result.token.card.address_state) ? result.token.card.address_state : ''
            }

            payByExpress();
        }
    }

    function payByExpress(){
        $appDataState.currentScreen = 'payment-data'
        $appDataState.prevScreen = screenObj.screenOrder
    }
</script>

<style lang="less">
    .payment-buttons-cont button{
        border: 2px solid @mainColor;
        margin-bottom: 8px;
        background-color: @mainColor;
        color: @secondaryColor;
        text-transform: uppercase;
        font-weight: 800;
        letter-spacing: 1px;
        font-size: 1.75rem;
        padding: .45em 1em .25em;
        width: 100%;
        -webkit-appearance: none;
        -moz-appearance: none;
        font-family: @dropdownFontFamily;
        span{
            vertical-align: middle;
            &:after{
                content: "";
                display: inline-block;
                background-repeat: no-repeat;
                background-position: center;
                background-size: contain;
                width: 70px;
                height: 30px;
                margin-left: 16px;
                vertical-align: middle;
            }
        }
        &.mc.visa{
            span:after{
                width: 110px;
                height: 25px;
                margin-top: -3px;
                background-image: url(/assets/payment-logos/mc_symbol.svg),url(/assets/payment-logos/Visa_2014_logo_detail.svg.png);
                background-repeat: no-repeat,no-repeat;
                background-position: left center,right center;
                background-size: contain,60px;
            }
        }
        &.fast-pay{
            .apay:after{
                background-image: url(/assets/payment-logos/1280px-Apple_Pay_logo.svg.png);
                margin-top: -8px;
            }
            .gpay:after{
                margin-top: -8px;
                margin-left: 0 !important;
                background-image: url('/assets/payment-logos/1280px-Google_Pay_(GPay)_Logo.svg.png');
            }
        }
        &:focus{
            outline: none;
        }
    }
</style>

<Screen currScreenObj={screenObj} bind:screenHeight={screenHeight}>
    <h2>Payment options</h2>
    <div class="payment-buttons-cont">
        <button class="mc visa" on:click|preventDefault="{payByCardHandler}"><span>Credit card</span></button>
        <button class="fast-pay" on:click|preventDefault="{expressPayHandler}"><span class="gpay"></span><span class="apay"></span></button>
        {#if error}
            <ErrorComponent visible={!!error} message={error}/>
        {/if}
    </div>
    <form on:submit|preventDefault>
        <LabelComponent forName="maximize-donation-p" className="data-label max-donation">
            <input type="checkbox" bind:checked={$appDataState.maximizeDonation} name="maximize-donation-p" on:change={maximizeHandler}>{$defaultAppState.processingCopy}
        </LabelComponent>
    </form>
    <BackButton {backHandler}/>
</Screen>