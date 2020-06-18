//Validator state and listener setup functions

import { writable } from 'svelte/store'

export default function (validators) {
    if (validators) {
        const { subscribe, set } = writable({
            dirty: false,
            isValid: false,
            message: null
        })

        function validate(targetNode) {                  
            const failing = validators.find((v) => {
                return v(targetNode) !== true
            })

            set({
                dirty: true,
                isValid: !failing,
                message: failing && failing(targetNode)
            })
        }

        function action(node) {
            node.addEventListener('change', (e) => validate(e.target))
            node.addEventListener('input', (e) => validate(e.target))

            return {
                destroy: () => {
                    node.removeEventListener('change', (e) => validate(e.target))
                    node.removeEventListener('input', (e) => validate(e.target))
                }
            }
        }

        return [{ subscribe }, action, validate]
    }
}