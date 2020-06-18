//Validation rules functions

export default {
    email() {
        return function email(node) {
            const invalidMessage = 'Please enter a valid email'
            return node.value &&
                !!node.value.match(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/) || invalidMessage
        }
    },
    number() {
        return function number(node) {
            const invalidMessage = 'Please enter a valid number'
            return node.value &&
                !!node.value.match(/^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/) || invalidMessage
        }
    },
    minNumber(minValue) {
        return function minNumber(node) {
            const invalidMessage = `Minimum amount is ${minValue}`
            return node.value &&
                (node.value >= minValue) || invalidMessage
        }
    },
    required() {
        return function required(node) {
            const invalidMessage = 'This field is required'
            return !!node.value || invalidMessage
        }
    },
    lettersonly() {
        return function lettersonly(node) {
            const invalidMessage = 'You are allowed to use letters only'
            return node.value &&
                !!node.value.match(/^[a-z '`-]+$/i) || invalidMessage
        }
    },
    minLength(minValue) {
        return function minLength(node) {
            const invalidMessage = `Please, at least ${minValue} characters are necessary`
            return node.value &&
                (node.value.length >= minValue) || invalidMessage
        }
    },
    maxLength(maxValue) {
        return function minLength(node) {
            const invalidMessage = `Please, limit your message to ${maxValue} characters`
            return node.value &&
                (node.value.length <= maxValue) || invalidMessage
        }
    }
}
