<script>
    import { appDataState, defaultAppState, stripeState} from "../globals.js"
    import formValidator from './../validator/formValidator.js'

    import Select from 'svelte-select'

    import Screen from '../components/Screen.svelte'
    import LabelComponent from './../components/form-components/LabelComponent.svelte'
    import ValidatedInput from './../components/form-components/ValidatedInput.svelte'

    export let screenObj
    export let screenHeight

    $appDataState.gaName = $defaultAppState.gaName || false
    $appDataState.currentCurrency = $defaultAppState.currenciesArr.reduce((res, item, index) => ($defaultAppState.defaultCurrency === item.name) ? item : res)
    $appDataState.currentAmount = ($defaultAppState.defaultAmount) ? parseInt(($defaultAppState.defaultAmount/100).toFixed(0)) : parseInt(($appDataState.currentCurrency.defaultAmount/100).toFixed(0))
    $appDataState.currentInterval = $defaultAppState.regularArr.reduce((res, item, index) => ($defaultAppState.defaultInterval === item.id) ? item : res)
    $: currencyList = $defaultAppState.currenciesArr.map((item)=> { return {id: item.name.toLowerCase(), text: item.name, ...item}})
    $: $appDataState.amountToPay = ($appDataState.maximizeDonation) ? $appDataState.currentAmount*100*1.02 : $appDataState.currentAmount*100
    

    //Stripe specific function
    async function stripePaymentCheck(){
        if($stripeState.paymentRequest){
            $stripeState.paymentRequest.update({
                currency: $appDataState.currentCurrency.name.toLowerCase(),
                total: {
                    label: 'CureCancer Australia Donation',
                    amount: $appDataState.amountToPay
                }
            })
        } else {
            let isPaymentAvailable
            $stripeState.paymentRequest = $stripeState.stripe.paymentRequest({
                country: 'AU',
                currency: $appDataState.currentCurrency.name.toLowerCase(),
                total: {
                    label: 'CureCancer Australia Donation',
                    amount: $appDataState.amountToPay,
                },
                requestPayerName: true,
                requestPayerEmail: true,
            });        
            isPaymentAvailable = await $stripeState.paymentRequest.canMakePayment()
            $stripeState.expressPaymentAvailable = $defaultAppState.paymentTypeSelection && isPaymentAvailable 
        }
        
    }

    //Fields handlers
    function selectCurrency(){        
        $appDataState.currentAmount = parseInt(($appDataState.currentCurrency.defaultAmount/100).toFixed(0))        
    }

    //Validation functions
    let fields = ['donation-amount']
    let { fieldsObject, shakeErrors, validationHelpers } = formValidator(fields)    

    //Screen change handlers
    async function donateHandler(){        
        validationHelpers.isFormValid(async () => {            
            await stripePaymentCheck()
            if($stripeState.expressPaymentAvailable){
                $appDataState.currentScreen = 'payment-options'
            } else {
                $appDataState.currentScreen = 'payment-data'
            }        
            
            $appDataState.prevScreen = screenObj.screenOrder
        })
    }

    function inHonourHandler(){
        validationHelpers.isFormValid(async ()=> {
            await stripePaymentCheck()
            $appDataState.currentScreen = 'in-honour'
            $appDataState.prevScreen = screenObj.screenOrder
            $appDataState.inHonourDonation = true
        })
    }

    function addReasonHandler() {
        validationHelpers.isFormValid(async ()=> {
            await stripePaymentCheck()
            $appDataState.currentScreen = 'donation-reason'
            $appDataState.prevScreen = screenObj.screenOrder
            $appDataState.donationReason = true
        })
    }

    function amountButtonHandler(e) {
        $appDataState.currentAmount = e.target.attributes['data-amount'].value/100;
        $appDataState.amountToPay = ($appDataState.maximizeDonation) ? $appDataState.currentAmount*100*1.02 : $appDataState.currentAmount*100
    }    
</script>

<style lang="less">
    @import './../styles/variables.less';
    @import './../styles/mixins.less';
    form>div, form>label{
        margin: 0 0 4px;
    }
    form{
        :global(label){
            margin-bottom: 6px;
        }
        :global(.amount-label){
            position: relative;
            font-size: 1.875rem;
            font-family: @dropdownFontFamily; 
            margin-bottom: 6px;
        }
        :global(input[name="donation-amount"]){
            color: @mainColor;
            padding: .35em .666667em .2em 1.3em;
            background-color@secondaryColor;
            -moz-appearance: textfield;
            border-color: @amountInputBorderColor;
            height: 45px !important;
            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
        }
        :global(.currency .selectedItem .selection, .currency .listContainer .listItem .item){
            display: flex;
            align-items: center;
        }
        :global(.currency .listContainer .listItem .item, .regular .listContainer .listItem .item){
            .dropdown-font;
        }
        :global(.currency .selectedItem .selection img, .currency .listContainer .listItem .item img){
            margin-right: 0.25em;
            margin-top: -4px;
        }
        :global(.currency .selectedItem, .regular .selectedItem) {
            .dropdown-font;
        }
    }
    :global(.stripe-form-wrapper-i .stripe-form-i .amount-cont .selectContainer, .stripe-form-wrapper-i .stripe-form-i .amount-cont .selectContainer:hover, .stripe-form-wrapper-i .stripe-form-i .amount-cont .selectContainer.focused){
        border-color: @amountInputBorderColor;
        background-color@secondaryColor;
    }
    :global(.stripe-form-wrapper-i .stripe-form-i .amount-cont .selectContainer){
        :global(.listContainer){
            border-color: @amountInputBorderColor;
        }
        :global(.selectedItem .selection){
            padding-top: 2px;
        }
    }
    :global(.stripe-form-wrapper-i .stripe-form-i .amounts-wrapper){
        margin: 0 0 6px;
    }
    :global(.stripe-form-wrapper-i .stripe-form-i .small-cta){
        margin: 0 0 0.5em;
        text-align: left;
    }
    h1{
        margin-bottom: 0.5rem;
        @media (max-width: 1110px){
            font-size: 1.75rem;
            
        }
        @media (max-width: 374px){
            font-size: 1.55rem;
        }
    }
    .amounts-wrapper{
        display: flex;
        justify-content: space-between;
        margin: 0 0 .375em;
        .amount-button{
            border-radius: 0;
            width: 70px;
            height: 45px;
            font-size: 22px;
            line-height: .9;
            padding: 0;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            font-family: @dropdownFontFamily;
            color: @fontColor;
            border: 1px solid @amountInputBorderColor;
            background-color: @secondaryColor;
            -webkit-transition: all .3s;
            -o-transition: all .3s;
            transition: all .3s;
            margin: 0;

            flex-grow: 1;
            flex-shrink: 1;
            margin-left: 6px;
            &:first-child{
                margin-left: 0;
            }
            &:hover{
                color: @mainColor;
                border-color: @mainColor;
            }
            &.active{
                background-color: @mainColor;
                color: @secondaryColor;
                border-color: @mainColor;
            }
            &:focus{
                outline: none;
            }
            @media (max-width: 930px){
                font-size: 1em;
            }
            @media (max-width: 767px){
                width: 54px;
            }
            @media (max-width: 374px){
                font-size: 16px;
                width: 50px;
            }
        }
    }

    .amount-symbol{
        position: absolute;
        top: 3px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 25px;
        z-index: 1;
    }
    
    .split{
        display: flex;
        flex-wrap: wrap;
        > *{
            flex: 1 1 50%;
            &:nth-child(2){
                text-align: right;
                @media (max-width: 930px){
                    text-align: left;
                }
            }
        }
    }

    .small-cta{
        .split &{
            font-size: 0.85em;
        }
        .small-cta-btn{
            white-space: nowrap;
            &:before{
                .squarespace-font;
                content: "\e003";
            }
        }
    }

    .submit-cont input{
        background-color: #00bcdb
    }
</style>

<Screen currScreenObj={screenObj} bind:screenHeight={screenHeight}>
    {#if $defaultAppState.headingCopy}
        <h1>{$defaultAppState.headingCopy}</h1>
    {/if}
    {#if $defaultAppState.paragraphCopy}
        <p>{$defaultAppState.paragraphCopy}</p>
    {/if}

    <form on:submit|preventDefault={donateHandler} id="amount-form">

        <LabelComponent forName="currency-selector" className="data-label currency">
            <Select items={currencyList} on:select={selectCurrency} bind:selectedValue={$appDataState.currentCurrency} isSearchable={false} isClearable={false} optionIdentifier='name' getOptionLabel={(option) => '<img src="/assets/flags/blank.gif" class="flag flag-' + option.flagCode + '" />' + option.symbol + ' ' + option.name} getSelectionLabel={(option) => '<img src="/assets/flags/blank.gif" class="flag flag-' + option.flagCode + '" />' + option.symbol + ' ' + option.name} placeholder='Select crurrency'/>
        </LabelComponent>

        <div class="amounts-wrapper">
            {#each $appDataState.currentCurrency.defaultValues as item}
                <button class={'amount-button'+((parseInt((item/100).toFixed(0)) === $appDataState.currentAmount) ? ' active' : '')} data-amount={item} on:click|preventDefault={amountButtonHandler}>{$appDataState.currentCurrency.symbol}{(item/100).toFixed(0)}</button>
            {/each}
        </div>

        <LabelComponent forName="donation-amount" className="amount-label">
            <slot name="above-input">
                <div class="amount-symbol">{$appDataState.currentCurrency.symbol}</div>
            </slot>
            <ValidatedInput type="number" name="donation-amount" bind:value={$appDataState.currentAmount} rules={{required: true, minNumber: 2, number: true}} on:valid={(e) => {validationHelpers.onValidHandler(e)}} on:invalid={(e) => {validationHelpers.onInvalidHandler(e)}} shakeError={$shakeErrors} bind:validateTrigger={fieldsObject['donation-amount'].validateTrigger}/>
        </LabelComponent>
        

        {#if !$defaultAppState.onceOffOnly}
            <LabelComponent forName="regular-selector" className="data-label regular">
                <Select items={$defaultAppState.regularArr} bind:selectedValue={$appDataState.currentInterval} isSearchable={false} isClearable={false} optionIdentifier='id' getOptionLabel={(option) => option.text} getSelectionLabel={(option) => option.text} placeholder='Select period'/>
            </LabelComponent>
            {#if $defaultAppState.askDonationReason}
                <div class="additional-options split">
                    <div class="small-cta">
                        <a class="small-cta-btn" href="/" on:click|preventDefault="{inHonourHandler}">Give in Honour?</a>
                    </div>
                    <div class="small-cta">
                        <a class="small-cta-btn" href="/" on:click|preventDefault="{addReasonHandler}">Add a donation reason?</a>
                    </div>
                </div>
            {:else}
                <div class="small-cta">
                    <a class="small-cta-btn" href="/" on:click|preventDefault="{inHonourHandler}">Give in Honour?</a>
                </div>
            {/if}
            
        {/if}
        
        <div class="submit-cont">
            <input type="submit" value="Donate" on:click|preventDefault="{donateHandler}" style={`background-color: ${$defaultAppState.defaultFrontButtonColor}; border-color: ${$defaultAppState.defaultFrontButtonColor}`}/>
        </div>
    </form>
    <div class="payment-types-cont"></div>
</Screen>