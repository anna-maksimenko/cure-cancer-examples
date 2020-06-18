<script>
    import { appDataState, reasonData, stripeState, defaultAppState } from "../globals.js"
    import formValidator from './../validator/formValidator.js'

    import Select from 'svelte-select'

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
            $reasonData.reasonMessage = node.value
        } else {
            node.value = $reasonData.reasonMessage
            charCount = 200 - $reasonData.reasonMessage.length
        }
    }

    //Validation functions
    let fields = ['str-reason']
    let { fieldsObject, shakeErrors, validationHelpers } = formValidator(fields)  

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
        $appDataState.currentScreen = 'amount'
        $appDataState.prevScreen = screenObj.screenOrder
        $appDataState.donationReason = false
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
    <form id="donationReason" on:submit|preventDefault={nextHandler}>
        <h2>Do you have a special reason for donating?</h2>
        <LabelComponent forName="regular-selector" className="data-label regular">
                <Select items={$defaultAppState.reasonsArr} bind:selectedValue={$reasonData.reasonSelection} isSearchable={false} isClearable={false} optionIdentifier='text' getOptionLabel={(option) => option.text} getSelectionLabel={(option) => option.text} placeholder='Select reason'/>
        </LabelComponent>        
        <p>Can you tell us more about your reason?</p>
        <LabelComponent forName="str-reason" className="data-label msg-data-label">
            <ValidatedInput type="textarea" name="str-reason" placeholder="Your donation reason" bind:value={$reasonData.reasonMessage} rules={{required: true, lettersonly: true, minLength: 2, maxLength: 200}} bind:this={messageBox} on:change={(e) => validateMessage(e.target)} on:input={(e) => validateMessage(e.target)} on:valid={(e) => {validationHelpers.onValidHandler(e)}} on:invalid={(e) => {validationHelpers.onInvalidHandler(e)}} shakeError={$shakeErrors} bind:validateTrigger={fieldsObject['str-reason'].validateTrigger}/>
            <div class="char-counter" class:red-text={charCount < 20}>{`${charCount} characters remaining`}</div>
        </LabelComponent>

        <NextButton {nextHandler}/>
        <BackButton {backHandler}/>
    </form>
</Screen>