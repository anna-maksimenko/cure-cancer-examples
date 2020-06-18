<script>
    import { appDataState, inHonourData } from "../globals.js"
    import formValidator from './../validator/formValidator.js'

    import Screen from '../components/Screen.svelte'
    import BackButton from '../components/BackButton.svelte'
    import NextButton from '../components/NextButton.svelte'
    import LabelComponent from './../components/form-components/LabelComponent.svelte'
    import ValidatedInput from './../components/form-components/ValidatedInput.svelte'

    export let screenObj
    export let screenHeight

    let messageBox
    let charCount = 200

    function validateMessage(node) {
        charCount = 200 - node.value.length
        if(charCount >= 0){
            $inHonourData.inHonourMessage = node.value
        } else {
            node.value = $inHonourData.inHonourMessage
            charCount = 200 - $inHonourData.inHonourMessage.length
        }
    }

    //Validation functions
    let fields = ['str-in-honour', 'str-from', 'str-message']
    let { fieldsObject, shakeErrors, validationHelpers } = formValidator(fields)  

    //Screen flip functions
    function nextHandler(){        
        validationHelpers.isFormValid(() => {
            $appDataState.currentScreen = 'to-honour'
            $appDataState.prevScreen = screenObj.screenOrder
        })        
    }

    function backHandler(){
        $appDataState.currentScreen = 'amount'
        $appDataState.prevScreen = screenObj.screenOrder
        $appDataState.inHonourDonation = false
    }
</script>

<style lang="less">
    form {
        .red-text{
            color: @mainColor;
        }
        :global(textarea){
            height: 100px;
            resize: none;
        }
        :global(.char-counter){
            text-align: right;
            font-size: .875rem;
            margin-top: 4px;
        }
    }
</style>

<Screen currScreenObj={screenObj} bind:screenHeight={screenHeight}>
    <form id="inHonourForm" on:submit|preventDefault={nextHandler}>
        <h2>Give in honour</h2>
        <p>We'll send an e-card to commemorate your gift</p>

        <LabelComponent forName="str-in-honour" className="data-label">
            <ValidatedInput type="text" name="str-in-honour" placeholder="In honour of" bind:value={$inHonourData.inHonourOf} rules={{required: true, lettersonly: true, minLength: 2}} on:valid={(e) => {validationHelpers.onValidHandler(e)}} on:invalid={(e) => {validationHelpers.onInvalidHandler(e)}} shakeError={$shakeErrors} bind:validateTrigger={fieldsObject['str-in-honour'].validateTrigger}/>
        </LabelComponent>
        <LabelComponent forName="str-from" className="data-label">
            <ValidatedInput type="text" name="str-from" placeholder="From" bind:value={$inHonourData.inHonourFrom} rules={{required: true, lettersonly: true, minLength: 2}} on:valid={(e) => {validationHelpers.onValidHandler(e)}} on:invalid={(e) => {validationHelpers.onInvalidHandler(e)}} shakeError={$shakeErrors} bind:validateTrigger={fieldsObject['str-from'].validateTrigger}/>
        </LabelComponent>
        <LabelComponent forName="str-message" className="data-label msg-data-label">
            <ValidatedInput type="textarea" name="str-message" placeholder="Your message" bind:value={$inHonourData.inHonourMessage} rules={{required: true, lettersonly: true, minLength: 2, maxLength: 200}} bind:this={messageBox} on:change={(e) => validateMessage(e.target)} on:input={(e) => validateMessage(e.target)} on:valid={(e) => {validationHelpers.onValidHandler(e)}} on:invalid={(e) => {validationHelpers.onInvalidHandler(e)}} shakeError={$shakeErrors} bind:validateTrigger={fieldsObject['str-message'].validateTrigger}/>
            <div class="char-counter" class:red-text={charCount < 20}>{`${charCount} characters remaining`}</div>
        </LabelComponent>

        <NextButton {nextHandler}/>
        <BackButton {backHandler}/>
    </form>
</Screen>