## Cure Cancer Australia donation module based on [Svelte](https://svelte.dev/)
*Styling will look odd due to Squarespace website styles inheritance in prod env. To see final look&feel, please, visit [Cure Cancer Australia website](https://curecancer.com.au)*

### Features (related to my field of responsibility):
- Creating and styling components without/with basic logic
- Reusable components across the application
- Two different style modes for the module (embedded and banner mode)
- Make components possible to inherit website theme styles (to reduce code base and amount of integration work to be done)
- Screen change custom animation based on screen order with possibility to easily upgrade/adjust it (link svelte-stripe-donation-module/src/components/Screen.svelte)

### Setup:
- [Svelte](https://svelte.dev/)
- [Rollup svelte plugin](https://www.npmjs.com/package/rollup-plugin-svelte)
- [Stripe](https://stripe.com/)
- [Svelte-select](https://github.com/rob-balfre/svelte-select)
- [reCaptcha v3](https://developers.google.com/recaptcha/docs/v3)
- [AWS for payments processing and reCaptcha verification](https://aws.amazon.com/lambda/)
