//Form validation wrappers and handlers

import { writable } from 'svelte/store'

export default function (fields) {
    let shakeErrors = writable(false)
    let fieldsObject = {}
    fields.map(function(item) {
        fieldsObject[item] = {
            isValid: false,
            isPresent: true,
            validateTrigger: () => {}
        }
    })

    function onValidHandler(e) {
        fieldsObject[e.detail.name].isValid = true        
    }

    function onInvalidHandler(e) {
        fieldsObject[e.detail.name].isValid = false
    }

    function isFormValid(callback) {
        let formValidity = !Object.keys(fieldsObject).some((val) => {
            if (!!fieldsObject[val].isPresent){
                fieldsObject[val].validateTrigger()
                return !fieldsObject[val].isValid
            }
            return false            
        })

        if (formValidity) {
            callback()
        } else {
            shakeErrors.set(true)
            setTimeout(() => shakeErrors.set(false), 1000)
        }
    }

    return { fieldsObject, shakeErrors, validationHelpers: { onValidHandler, onInvalidHandler, isFormValid } }
}