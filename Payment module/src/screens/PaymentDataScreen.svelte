<script>
    import { onMount } from 'svelte';

    import { appDataState, defaultAppState, paymentData, inHonourData, reasonData, stripeState } from '../globals.js'
    import { lambdaEnvironments } from '../constants.js'

    import formValidator from './../validator/formValidator.js'

    import Select from 'svelte-select';

    import Screen from '../components/Screen.svelte'
    import Spinner from '../components/Spinner.svelte'
    import BackButton from '../components/BackButton.svelte'
    import ErrorComponent from '../components/form-components/ErrorComponent.svelte'
    import LabelComponent from './../components/form-components/LabelComponent.svelte'
    import ValidatedInput from './../components/form-components/ValidatedInput.svelte'

    export let screenObj
    export let screenHeight

    let selectedCountry = $defaultAppState.countriesArr.reduce((res, item) => (item.name === 'Australia') ? item : res)
    let cardValidated
    let lockForm = false
    let cardError
    
    $: $paymentData.payerCountry = selectedCountry.name
    
    onMount(() => {
        if(!$stripeState.expressCheckoutSelected){
            //Stripe card mount
            $stripeState.card.mount('#strCardCont');
            $stripeState.card.on('change', function(event) {
                if(event.complete){
                    cardError = null
                    cardValidated = true
                } else {
                    cardValidated = false
                    if (event.error) {
                        cardError = event.error.message
                    } else {
                        cardError = null
                    }
                }
            });
        } else {
            cardValidated = true
        }	
    });

    //Form handlers
    function maximizeHandler(){
        $appDataState.amountToPay = ($appDataState.maximizeDonation) ? $appDataState.currentAmount*100*1.02 : $appDataState.currentAmount*100
        $stripeState.paymentRequest.update({
          total: {
            label: 'CureCancer Australia Donation',
            amount: $appDataState.amountToPay
          }
        })
    }

    //Validation functions
    let fields = ['str-fname', 'str-lname', 'str-email', 'str-address', 'str-city', 'str-zipcode', 'str-state']
    let { fieldsObject, shakeErrors, validationHelpers } = formValidator(fields)
    $: showStateField = (selectedCountry.code === "AU" || selectedCountry.code === "US") ? true : false
    $: fieldsObject['str-state'].isPresent = showStateField

    //Flip and submit handlers
    function backHandler(){
        if($stripeState.expressPaymentAvailable){
            $appDataState.currentScreen = 'payment-options'
        } else if($appDataState.inHonourDonation){
            $appDataState.currentScreen = 'to-honour'
        } else if($appDataState.donationReason){
            $appDataState.currentScreen = 'donation-reason'
        } else {
            $appDataState.currentScreen = 'amount'
        }
        $appDataState.prevScreen = screenObj.screenOrder
    }

    function editInHonourHandler(){
        if($inHonourData.inHonourToOther){
            $appDataState.currentScreen = 'to-honour'
        } else {
            $appDataState.currentScreen = 'in-honour'
        }
        $appDataState.prevScreen = screenObj.screenOrder
    }
    
    function showFinishingScreen(){
        $appDataState.currentScreen = 'finishing'
        $appDataState.prevScreen = 5
    }

    //Stripe functions
    function cardMouseoutHandler() {
        $stripeState.card.blur()
    }  
    
    async function createToken(){
        validationHelpers.isFormValid(async () => {
            lockForm = true
            if($stripeState.expressCheckoutSelected){
                donateHandler()
            } else {
                let tokenResponse = await $stripeState.stripe.createToken($stripeState.card)
                if(tokenResponse.error){
                    cardError = tokenResponse.error.message
                    lockForm = false
                } else {
                    cardError = null
                    $stripeState.cardToken = tokenResponse.token
                    if(tokenResponse.token.id){
                        donateHandler()
                    }
                }
            } 
        })
    }

    //Donation handler function
    async function donateHandler() {
        const isExpress = $stripeState.expressCheckoutSelected
        const isGANamePresent = ($appDataState.gaName !== false)
        const isInHonour = $appDataState.inHonourDonation
        const hasReason = $appDataState.donationReason
        const reqObj = {
            tokenId: $stripeState.cardToken.id,
            amount: $appDataState.amountToPay,
            currency: $appDataState.currentCurrency.name.toLowerCase(),
            isRegularGiver: ($appDataState.currentInterval.id !== "onceoff") ? true : false,
            donationFrequency: $appDataState.currentInterval.id,
            payerName: $paymentData.payerName,
            payerLastname: $paymentData.payerLastName,
            cusEmail: $paymentData.payerEmail,
            addressLine: $paymentData.payerAddress,
            addressCity: $paymentData.payerCity,
            addressCountry: $paymentData.payerCountry,
            addressCode: $paymentData.payerZIP,
            ...showStateField && {
                addressState: $paymentData.payerState
            },
            donationCoveredFee: $appDataState.maximizeDonation,
            ...isExpress && {
                expressCheckout: $stripeState.expressCheckoutSelected
            },
            ...isGANamePresent && {
                gaName: $appDataState.gaName
            },
            ...isInHonour && {
                inHonorFlag: $appDataState.inHonourDonation,
                honorTo: $inHonourData.inHonourOf,
                honorFrom: $inHonourData.inHonourFrom,
                honorMessage: $inHonourData.inHonourMessage,
                honoreeEmail: $inHonourData.honoreesEmail,
                honoreeName: $inHonourData.honoreesName,
                sendCopyToPayer: $inHonourData.sendACopy
            },
            ...hasReason && {
                donationReason: $reasonData.reasonSelection.id,
                reasonMessage: $reasonData.reasonMessage
            }
        }
        let encodedRequest = ''
        let currentEnvironment = ($defaultAppState.testMode) ? lambdaEnvironments.test : lambdaEnvironments.live

        //Re-captcha 3 integration
        grecaptcha.ready(function() {
            grecaptcha.execute('6LeQ0cAUAAAAAByJquA53j58inQTrHAk-b_QOpOH', {action: 'payment_submit'}).then(async function(token) {
                reqObj.captchaToken = token
                //Data encoding and request to server-less function
                Object.keys(reqObj).map(function(key, index) {
                    encodedRequest += encodeURIComponent(key)+'='+encodeURIComponent(reqObj[key])+'&'
                });        
                let request = await fetch(currentEnvironment + '?' + encodedRequest.substring(0, encodedRequest.length - 1))
                let response = await request.json()
                responseHandler(response);
            });
        });
    }

    //Lambda response handler function
    function responseHandler(responseData){
        if(responseData.response === "Success"){
            const respTagData = responseData.tagData
            $stripeState.cardToken = {}
            dataLayer = dataLayer || []
            dataLayer.push({
                'transactionId': respTagData.trId,
                'transactionTotal': respTagData.trAmount,
                'transactionCurrency': respTagData.trCurrency.toUpperCase(),
                'transactionProducts': [{
                    'sku': respTagData.trSKU,
                    'name': respTagData.trProduct,
                    'category': 'Donation',
                    'price': respTagData.trAmount,
                    'quantity': 1
                }],
                'event' : 'donationMade',
                'eventCallback': function() {
                    if($defaultAppState.showFinishingScreen){
                        showFinishingScreen()
                    } else if($defaultAppState.redirectUrl){
                        window.location.href = $defaultAppState.redirectUrl
                    } else {
                        if(respTagData.trSKU === "1"){
                            window.location.href = '/donate-success'
                        } else if(respTagData.trSKU === "2") {
                            window.location.href = '/donate-success-rg'
                        } else {
                            console.log('Something went wrong with success redirect')
                        }
                    }
                },
                'eventTimeout' : 2000
            })
        } else if(responseData.response === "Error"){
            console.log('Error occured :'+responseData.errorMessage)
            cardError = responseData.errorMessage
            lockForm = false
        } else {
            console.log('Something went wrong, no success response');
            cardError = 'Something went wrong, no success response'
            lockForm = false
        }
    }
</script>

<style lang="less">
    .data-fieldset{
        display: flex;
        margin: 0 0 0 -1%;
        :global(>label){
            flex-basis: 50%;
            margin-left: 1%;
        }
        &.full-width{
            :global(>label){
                flex-basis: 100%;
            } 
        }
    }
    .stripe-card-cont{
        box-sizing: border-box;
        margin-bottom: .5em;
        border: 1px solid @inputBorderColor;
        background-color: @inputBorderColor;
        padding: 12px 9px;
        @media (max-width: 767px){
            padding: 9px;
        }
        @media (max-width: 374px){
            padding: 7px;
        }
    }
    input[type="submit"]{
        transition: background-color 0.5s;
        &[disabled]{
            background-color: fadeout(@mainColor, 80%);
        }
        @media (max-width: 767px){
            font-size: 1.2rem;
        }
    }
    .card-outer-wrapper{
        position: relative;
        :global(.error){
            margin-top: -3px;
        }
    }
    .honorees-name{
        display: block;
        font-size: .8125rem;
        margin-bottom: .625rem;
        .fa:before{
            content: "\f044";
            margin-left: .5rem;
            
        }
    }
    #data-form :global(.selectContainer), #data-form :global(.selectContainer input), #data-form :global(.selectContainer .selectedItem), #data-form :global(.selectContainer .selection){
        @media (max-width: 767px){
            height: 38px;
            line-height: 38px;
        }
        @media (max-width: 374px){
            height: 34px;
            line-height: 34px;
        }
    }
</style>

<Screen currScreenObj={screenObj} bind:screenHeight={screenHeight}>
    <form id="data-form" on:submit|preventDefault={createToken}>
        <div class="contents-title">
            <h2>{`${($appDataState.inHonourDonation) ? 'Give' : 'Donate'} ${($appDataState.currentAmount>0) ? $appDataState.currentCurrency.symbol+$appDataState.currentAmount : ''} ${($appDataState.currentInterval.id !== 'onceoff') ? $appDataState.currentInterval.text.toLowerCase() : ''}`}</h2>
        </div>
        {#if $appDataState.inHonourDonation}
            <p class="honorees-name">An e-card will be sent to {($inHonourData.inHonourToOther) ? $inHonourData.honoreesName : $inHonourData.inHonourOf}<i class="fa fa-pencil-alt" on:click|preventDefault={editInHonourHandler}></i></p>
        {/if}
        

        <div class="contents-input">

            <div class="data-fieldset name-fieldset">
                <LabelComponent forName="str-fname" className="data-label">
                    <ValidatedInput type="text" disabled={lockForm} name="str-fname" placeholder="First name" bind:value={$paymentData.payerName} rules={{required: true, lettersonly: true, minLength: 2}} on:valid={(e) => {validationHelpers.onValidHandler(e)}} on:invalid={(e) => {validationHelpers.onInvalidHandler(e)}} shakeError={$shakeErrors} bind:validateTrigger={fieldsObject['str-fname'].validateTrigger}/>
                </LabelComponent>
                <LabelComponent forName="str-lname" className="data-label">
                    <ValidatedInput type="text" disabled={lockForm} name="str-lname" placeholder="Last name" bind:value={$paymentData.payerLastName} rules={{required: true, lettersonly: true, minLength: 2}} on:valid={(e) => {validationHelpers.onValidHandler(e)}} on:invalid={(e) => {validationHelpers.onInvalidHandler(e)}} shakeError={$shakeErrors} bind:validateTrigger={fieldsObject['str-lname'].validateTrigger}/>
                </LabelComponent>
            </div>

            <LabelComponent forName="str-email" className="data-label">
                <ValidatedInput type="text" disabled={lockForm} name="str-email" placeholder="Email" bind:value={$paymentData.payerEmail} rules={{required: true, email: true}} on:valid={(e) => {validationHelpers.onValidHandler(e)}} on:invalid={(e) => {validationHelpers.onInvalidHandler(e)}} shakeError={$shakeErrors} bind:validateTrigger={fieldsObject['str-email'].validateTrigger}/>
            </LabelComponent>

            <LabelComponent forName="str-address" className="data-label">
                <ValidatedInput type="text" disabled={lockForm} name="str-address" placeholder="Street" bind:value={$paymentData.payerAddress} rules={{required: true, minLength: 2}} on:valid={(e) => {validationHelpers.onValidHandler(e)}} on:invalid={(e) => {validationHelpers.onInvalidHandler(e)}} shakeError={$shakeErrors} bind:validateTrigger={fieldsObject['str-address'].validateTrigger}/>
            </LabelComponent>

            <div class="data-fieldset city-postcode">
                <LabelComponent forName="str-city" className="data-label">
                    <ValidatedInput type="text" disabled={lockForm} name="str-city" placeholder="City" bind:value={$paymentData.payerCity} rules={{required: true, minLength: 2}} on:valid={(e) => {validationHelpers.onValidHandler(e)}} on:invalid={(e) => {validationHelpers.onInvalidHandler(e)}} shakeError={$shakeErrors} bind:validateTrigger={fieldsObject['str-city'].validateTrigger}/>
                </LabelComponent>
                <LabelComponent forName="str-code" className="data-label">
                    <ValidatedInput type="text" disabled={lockForm} name="str-zipcode" placeholder="Postcode" bind:value={$paymentData.payerZIP} rules={{required: true, minLength: 3}} on:valid={(e) => {validationHelpers.onValidHandler(e)}} on:invalid={(e) => {validationHelpers.onInvalidHandler(e)}} shakeError={$shakeErrors} bind:validateTrigger={fieldsObject['str-zipcode'].validateTrigger}/>
                </LabelComponent>
            </div>

            <div class="data-fieldset country-state" class:full-width={!showStateField}>
                {#if showStateField}
                    <LabelComponent forName="str-state" className="data-label">
                        <ValidatedInput type="text" disabled={lockForm} name="str-state" placeholder="State" bind:value={$paymentData.payerState} rules={{required: true, minLength: 2}} on:valid={(e) => {validationHelpers.onValidHandler(e)}} on:invalid={(e) => {validationHelpers.onInvalidHandler(e)}} shakeError={$shakeErrors} bind:validateTrigger={fieldsObject['str-state'].validateTrigger}/>
                    </LabelComponent>
                {/if}
                <LabelComponent className="data-label">
                    <Select items={$defaultAppState.countriesArr} bind:selectedValue={selectedCountry} isClearable={false} optionIdentifier='name' getOptionLabel={(option) => option.name} getSelectionLabel={(option) => option.name} placeholder='Select country' isDisabled={lockForm}/>
                </LabelComponent>
            </div>

        </div>
        
        <div class="card-outer-wrapper">
            {#if !$stripeState.expressCheckoutSelected}
                <div class="stripe-card-cont" id="strCardCont" on:mouseout={cardMouseoutHandler}></div>
            {/if}
            <ErrorComponent visible={!!cardError} message={cardError}/>
        </div>

        <LabelComponent forName="maximize-donation-p" className="data-label max-donation">
            <input type="checkbox" bind:checked={$appDataState.maximizeDonation} name="maximize-donation-p" on:change={maximizeHandler} disabled={lockForm}>{$defaultAppState.processingCopy}
        </LabelComponent>
        {#if !lockForm}
            <div class="submit-cont">
                <input type="submit" disabled={!cardValidated} value="{`Donate ${($appDataState.amountToPay>0) ? ($appDataState.currentCurrency.symbol+(($appDataState.amountToPay/100))) : ''}`}" on:click|preventDefault={createToken}/>
            </div>
            <BackButton {backHandler} disclaimerVisible={true}/>
        {:else}
            <Spinner/>
        {/if}
    </form>
</Screen>