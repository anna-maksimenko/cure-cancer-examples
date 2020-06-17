(function () {
    function numberRoll() {
        //1. select all elements with specific class
        $('.number-to-change').each(function () {
            //2. grab number from each element 
            var $this = $(this);
            $({ Counter: 0 }).animate({ Counter: $this.attr('data-target') }, {
                duration: 1000,
                easing: 'swing',
                step: function () {
                    if ($this.hasClass('number-to-change-float')) {
                        $this.text(this.Counter.toFixed(1));
                    } else {
                        $this.text(Math.ceil(this.Counter));
                    }
                },
                complete: function () {
                    $this.text($this.attr('data-target'));
                }
            });
        });
    }

    function isScrolledIntoView(elem) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = elem.offset().top;
        var elemBottom = elemTop + elem.height();

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    }

    $(function () {
        if ($('.interactive-numb-outer-wrapper')[0]) {
            setTimeout(function () {
                if (isScrolledIntoView($('.interactive-numb-outer-wrapper'))) {
                    numberRoll();
                } else {
                    var scrollviewEvent = $(document).on('scroll', function () {
                        if (isScrolledIntoView($('.interactive-numb-outer-wrapper'))) {
                            scrollviewEvent.off();
                            numberRoll();
                        }
                    })
                }
            }, 1000);
        }
    })

}());