    //Screen consts for flipping the screens
    import {
        AmountScreen,
        DonationReasonScreen,
        InHonourScreen,
        ToHonourScreen,
        PaymentOptionsScreen,
        PaymentDataScreen,
        FinishingScreen
    } from './index.js'

    export const screens = {
        'amount': {
            name: 'amount',
            component: AmountScreen,
            class: 'amount-cont',
            screenOrder: 0
        }, 
        'donation-reason': {
            name: 'donation-reason',
            component: DonationReasonScreen,
            class: 'donation-reason-cont',
            screenOrder: 1
        },
        'in-honour': {
            name: 'in-honour',
            component: InHonourScreen,
            class: 'in-honour-cont',
            screenOrder: 1
        }, 
        'to-honour': {
            name: 'to-honour',
            component: ToHonourScreen,
            class: 'send-to-cont',
            screenOrder: 2
        }, 
        'payment-options': {
            name: 'payment-options',
            component: PaymentOptionsScreen,
            class: 'payment-cont',
            screenOrder: 3
        }, 
        'payment-data': {
            name: 'payment-data',
            component: PaymentDataScreen,
            class: 'data-cont',
            screenOrder: 4
        },
        'finishing': {
            name: 'finishing',
            component: FinishingScreen,
            class: 'finishing-cont',
            screenOrder: 5
        }
    }