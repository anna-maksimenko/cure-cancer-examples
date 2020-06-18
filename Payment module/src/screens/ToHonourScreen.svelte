<script>
    import { beforeUpdate, afterUpdate } from 'svelte';

    import { appDataState, inHonourData, stripeState } from "../globals.js"
    import formValidator from './../validator/formValidator.js'

    import Screen from '../components/Screen.svelte'
    import BackButton from '../components/BackButton.svelte'
    import NextButton from '../components/NextButton.svelte'
    import LabelComponent from './../components/form-components/LabelComponent.svelte'
    import ValidatedInput from './../components/form-components/ValidatedInput.svelte'

    export let screenObj
    export let screenHeight

    let sendToOtherPerson = ($inHonourData.inHonourToOther) ? 'to someone else' : 'to in-honour person'
    $: {$inHonourData.inHonourToOther = (sendToOtherPerson === 'to in-honour person') ? false : true}

    //Validation functions
    let fields = ['str-hon-name', 'str-hon-email']
    let { fieldsObject, shakeErrors, validationHelpers } = formValidator(fields)
    $: fieldsObject['str-hon-name'].isPresent = $inHonourData.inHonourToOther

    //Screen flip functions
    function nextHandler(){
        validationHelpers.isFormValid(() => {        
            if($stripeState.expressPaymentAvailable){
                $appDataState.currentScreen = 'payment-options'
            } else {
                $appDataState.currentScreen = 'payment-data'
            }  
            $appDataState.prevScreen = screenObj.screenOrder
        })
    }

    function backHandler(){
        $appDataState.currentScreen = 'in-honour'
        $appDataState.prevScreen = screenObj.screenOrder
    }
</script>

<Screen currScreenObj={screenObj} bind:screenHeight={screenHeight}>
    <form id="inHonourForm" on:submit|preventDefault={nextHandler}>
        <h2>Give in honour</h2>
        <p>Where should we send e-card?</p>
        <LabelComponent className="radio-to-in-honour">
            <input type="radio" name="str-send-to" checked value="to in-honour person" bind:group="{sendToOtherPerson}"><span>To {$inHonourData.inHonourOf}</span>
        </LabelComponent>
        <LabelComponent className="radio-to-other">
            <input type="radio" name="str-send-to" value="to someone else" bind:group="{sendToOtherPerson}"><span>To someone else</span>
        </LabelComponent>
        
        {#if $inHonourData.inHonourToOther}
            <LabelComponent isTransitioned={true} forName="str-hon-name" className="data-label">
                <ValidatedInput type="text" name="str-hon-name" placeholder="Honoree's name" bind:value={$inHonourData.honoreesName} rules={{required: true, lettersonly: true, minLength: 2}} on:valid={(e) => {validationHelpers.onValidHandler(e)}} on:invalid={(e) => {validationHelpers.onInvalidHandler(e)}} shakeError={$shakeErrors} bind:validateTrigger={fieldsObject['str-hon-name'].validateTrigger}/>
            </LabelComponent>
        {/if}
        <LabelComponent forName="str-hon-email" className="data-label">
            <ValidatedInput type="text" name="str-hon-email" placeholder="Honoree's email" bind:value={$inHonourData.honoreesEmail} rules={{required: true, email: true}} on:valid={(e) => {validationHelpers.onValidHandler(e)}} on:invalid={(e) => {validationHelpers.onInvalidHandler(e)}} shakeError={$shakeErrors} bind:validateTrigger={fieldsObject['str-hon-email'].validateTrigger}/>
        </LabelComponent>
        <LabelComponent>
            <input type="checkbox" value="Send a copy to me too" bind:checked="{$inHonourData.sendACopy}"> Send a copy to me too
        </LabelComponent>
        <NextButton {nextHandler}/>
        <BackButton {backHandler}/>
    </form>
</Screen>