(function() {
    var defaultOptions = {
        incomeSelectionData: [
            {
                id: 1,
                text: '$0 - $18,200',
                taxMultiplicator: 0
            },
            {
                id: 2,
                text: '$18,201 - $37,000',
                taxMultiplicator: 0.19

            },
            {
                id: 3,
                text: '$37,001 - $80,000',
                taxMultiplicator: 0.325
            },
            {
                id: 4,
                text: '$80,001 - $180,000',
                taxMultiplicator: 0.37
            },
            {
                id: 5,
                text: '$180,001 and above',
                taxMultiplicator: 0.45
            }
        ],
        heading: 'Calculate your potential tax benefit',
        description: 'Enter your donation amount and select your income bracket to estimate your potential, savings.',
        disclaimer: 'You may be eligible for a tax deduction for your donation over $2. These figures are based on Australian Taxation Office 2016/17 figures (excluding the Medicare levy) according to your individual circumstances. The amounts shown in the calculator above are a guide only, you should always seek independent financial advice.'

    },
    initOptions = {};
    
    function icomeSelectInit() {
        //Income dropdown setup
        $('.income-selection').select2({
            placeholder: "Select income",
            data: initOptions.incomeSelectionData,
            minimumResultsForSearch: Infinity
        });
        $('.tax-calculator').validate({
            rules: {
                'tax-donation-amount': {
                    number: true,
                    min: 0
                }
            },
            errorClass: 'field-error clearfix',
            errorElement: 'div',
            errorPlacement: function (error, element) {
                var errorCont = element.closest('form').find('.tax-error-cont')
                errorCont.append(error);
            },
            submitHandler: function (form, e) {
                savingsCalsulation($('.income-selection').select2('data')[0]);
            }
        });
        initUi();
    }

    function savingsCalsulation(incomeObj) {
        var donationAmount = parseFloat($('.donation').val());
        var taxSavings;

        if ($('.income-selection')[0] && $('.income-selection').select2('data') && $('.income-selection').select2('data')[0].id) {
            taxSavings = (((isNaN(donationAmount)) ? 0 : donationAmount) * incomeObj.taxMultiplicator * ($('.monthly-donation').is(':checked') ? 12 : 1)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $('.savings').val(taxSavings);
        }
    }

    function initUi() {
        $('.donation').on('input', function () {
            $('.tax-calculator').submit();
        });

        $('.income-selection').on('change', function () {
            $('.tax-calculator').submit();
        });

        $('.monthly-donation').on('change', function () {
            $('.tax-calculator').submit();
        })
    }

    function initMarkup() {
        var calcHeading = initOptions.heading,
            calcDescription = initOptions.description,
            calcDisclaimer = initOptions.disclaimer,
            htmlToInsert = '<div class="tax-calculator-form-inner-wrapper"><div class="outer-content"><h2>' + calcHeading + '</h2><p>' + calcDescription + '</p></div><form class="tax-calculator"><div class="tax-error-cont"></div><div class="data-fieldset donation-income-fieldset"><label for="tax-donation-amount">Donation amount<div class="currency-symbol">$</div><input  class="data-input donation" type="text"  name="tax-donation-amount"></label><label for="income">Income<select name="income" class="data-input income-selection" id="incomeSelection"><option></option></select></label></div><div class="monthly-donation-cont"><input type="checkbox" name="monthly" class="monthly-donation"><label for="monthly">View monthly donation savings</label></div><label for="savings">Savings<div class="currency-symbol">$</div><input class="data-input savings" type="text" name="savings" disabled></label></form><div class="disclaimer"><p>' + calcDisclaimer + '</p></div></div>',
            elemToInsert = $(htmlToInsert);
        $('.tax-calculator-form-outer-wrapper').append(elemToInsert);
        icomeSelectInit();
    }

    function optionGrab() {
        if (window.customSettings) {
            initOptions.incomeSelectionData = window.customSettings.incomeSelectionData || defaultOptions.incomeSelectionData;
            initOptions.heading = window.customSettings.heading || defaultOptions.heading;
            initOptions.description = window.customSettings.description || defaultOptions.description;
            initOptions.disclaimer = window.customSettings.disclaimer || defaultOptions.disclaimer;
            $('#custom-settings-script').remove();
        } else {
            initOptions = defaultOptions;
        }
        initMarkup();
    }

    $(function () {
        if ($('.tax-calculator-form-outer-wrapper')[0]) {
            optionGrab();
        }
    });	
}());
