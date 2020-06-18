<script>
    // Universal input component with custom validation
    import { onMount, createEventDispatcher } from 'svelte'
    
    import usedValidators from './../../validator/validationFunctions.js'
    import createValidator from './../../validator/validator.js'
    import ErrorComponent from './ErrorComponent.svelte'

    export let name
    export let value = 0
    export let type = 'text'
    export let placeholder = null
    export let rules = {
        required: false
    }
    export let disabled = false

    let error
    
    export let shakeError

    const dispatch = createEventDispatcher();

    let errorVisible = true

    let [ validity, action, validateCallback ] = createValidator(Object.keys(rules).map(function(key, index) {
        if(!!rules[key]){
            return usedValidators[key](rules[key])
        }
    }))

    let inputNode

    export function validateTrigger () {
        validateCallback(inputNode)
        resetError()
    }

    function resetError(){
        errorVisible = $validity.dirty && !$validity.isValid
        if($validity.isValid){
            dispatch('valid', inputNode)
        } else {
            dispatch('invalid', inputNode)
        }
    }

    onMount(() => {
        action(inputNode)
    })
</script>
<style>
    .input-wrapper{
        position: relative;
    }
</style>

<div class="input-wrapper">
    <slot name="above-input"></slot>
    {#if type === 'text'}
        <input type="text" {name} {placeholder} required={rules.required} bind:value={value} bind:this={inputNode} on:change={resetError} on:keyup={resetError} class:error={$validity.dirty && !$validity.isValid} {disabled}/>
    {:else if type === 'number'}
        <input type="number" {name} {placeholder} required={rules.required} bind:value={value} bind:this={inputNode} on:change={resetError} on:keyup={resetError} class:error={$validity.dirty && !$validity.isValid} {disabled}/>
    {:else if type === 'email'}
        <input type="email" {name} {placeholder} required={rules.required} bind:value={value} bind:this={inputNode} on:change={resetError} on:keyup={resetError} class:error={$validity.dirty && !$validity.isValid} {disabled}/>
    {:else if type === 'textarea'}
        <textarea {name} {placeholder} required={rules.required} bind:value={value} bind:this={inputNode} on:change={resetError} on:keyup={resetError} on:change on:input class:error={$validity.dirty && !$validity.isValid} {disabled}></textarea>
    {:else}
        <input type="text" {name} {placeholder} required={rules.required} bind:value={value} bind:this={inputNode} on:change={resetError} on:keyup={resetError} class:error={$validity.dirty && !$validity.isValid} {disabled}/>
    {/if}
    {#if $validity.dirty && !$validity.isValid && $validity.message}
        <ErrorComponent message={$validity.message} bind:visible={errorVisible} {shakeError}/>
    {:else if $validity.dirty && !$validity.isValid && !$validity.message}
        <ErrorComponent message="Something went wrong" bind:visible={errorVisible} {shakeError}/>
    {/if}
    <slot name="below-input"></slot>
</div>