"use strict";


$(function () {

    // init Fancybox Gallery
    if (typeof Fancybox !== "undefined" && Fancybox !== null) {
        Fancybox.bind("[data-fancybox]", {
            dragToClose: false,
        });
    }


    // Detect user Device
    const isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (
                isMobile.Android() ||
                isMobile.BlackBerry() ||
                isMobile.iOS() ||
                isMobile.Opera() ||
                isMobile.Windows());
        },
    };

    function getNavigator() {
        if (isMobile.any() || window.innerWidth < 768) {
            $("body").removeClass("_pc").addClass("_touch");
        } else {
            $("body").removeClass("_touch").addClass("_pc");
        }
    }
    getNavigator();
    $(window).on('resize', () => {
        getNavigator();
    });


    // custom select 

    $('select').each(function () {
        var $this = $(this), numberOfOptions = $(this).children('option').length;
        $this.addClass('select-hidden');
        $this.wrap('<div class="select"></div>');
        $this.after('<div class="select-styled"></div>');

        var $styledSelect = $this.next('div.select-styled');
        $styledSelect.text($this.children('option').eq(0).text());

        var $list = $('<ul />', {
            'class': 'select-options'
        }).insertAfter($styledSelect);

        // custom select
        for (var i = 0; i < numberOfOptions; i++) {
            $('<li />', {
                text: $this.children('option').eq(i).text(),
                'aria-label': $this.children('option').eq(i).val()
            }).appendTo($list);
        }
        var $listItems = $list.children('li');
        $($listItems[0]).addClass('active')
        $listItems.on("click", (function (e) {
            e.stopPropagation();
            $styledSelect.text($(this).text()).removeClass('active').addClass('selected');;
            $this.val($(this).attr('aria-label'));
            $(this).addClass('active').siblings().removeClass('active');
            $list.hide();
        }));

        $styledSelect.on("click", (function (e) {
            e.stopPropagation();
            $('div.select-styled.active').not(this).each(function () {
                $(this).removeClass('active').next('ul.select-options').hide();
            });
            $(this).toggleClass('active').next('ul.select-options').toggle();
        }));

        $(document).on("click", (function () {
            $styledSelect.removeClass('active');
            $list.hide();
        }));

    });


    // click handlers

    $(document).on('click', (e) => {
        let $target = $(e.target);

        // menu
        if ($target.hasClass('header__menu-btn')) {
            getMenu()
        }

        // submenu
        if ($target.hasClass('menu__link-parent')) {
            $('.submenu').fadeToggle();
            $target.toggleClass('menu__link-parent_active').parent().siblings().toggleClass('menu__item_disabled');
        }

        // catalog filter
        if ($target.hasClass('catalog__filter-btn') ||
            $target.hasClass('catalog__sidebar-close') ||
            ($target.hasClass('catalog__sidebar') && window.innerWidth < 1200)) {
            getFilter()
        }

        // cart open
        if ($target.hasClass('header__cart') ||
            $target.hasClass('cart__close') ||
            $target.hasClass('cart')) {
            getCart()
        }

        // order steps switch
        if ($target.hasClass('order__btn')) {
            let $step = $target.closest('.order__step');
            let $nextStep = $step.next();
            if ($nextStep.length > 0) {
                $step.removeClass('order__step_active');
                $nextStep.addClass('order__step_active');
            }
        }

        // faq
        if ($target.hasClass('info__faq-button')) {
            $target.toggleClass('info__faq-button_active');
            $target.next().slideToggle();
            $target.parent().siblings()
                .find('.info__faq-button').removeClass('info__faq-button_active').next().slideUp();

        }


    });

    $('.delivery-toggler').on('change', function (e) {
        let deliveryCategory = $(this).attr("value");
        $("#" + deliveryCategory).addClass('order__option_active').removeAttr('inert')
            .siblings().removeClass('order__option_active').attr('inert', '');
    })


    function getMenu() {
        $('.header__menu-btn').toggleClass('active');
        $('.header').toggleClass('header_open-menu');
        $('.menu').toggleClass('menu_open');
        toggleLocking()
    }

    function getFilter() {
        $('.catalog__sidebar').toggleClass('catalog__sidebar_open');
        toggleLocking("lock-filter")
    }

    function getCart() {
        $('.cart').toggleClass('cart_open');
        toggleLocking("lock-cart")
    }


    function toggleLocking(lockClass) {

        const $body = $('body');
        let className = lockClass ? lockClass : "lock";

        if ($body.hasClass(className)) {
            let pagePosition = parseInt($body.data("position"), 10);
            $body.css('top', 'auto');
            window.scroll({ top: pagePosition, left: 0 });
            $body.removeAttr('data-position');
        } else {
            let pagePosition = window.scrollY;
            $body.data('position', pagePosition);
            $body.css('top', -pagePosition + 'px');
        }

        let lockPaddingValue = $body.hasClass(className)
            ? "0px"
            : window.innerWidth - $(".wrapper").width() + "px";

        $body.css('--lock-padding', lockPaddingValue)

        // body.style.setProperty('', );
        $body.toggleClass(className);

    }


    // sliders 
    if ($(".main__slider").length > 0) {
        new Swiper('.main__slider', {
            slidesPerView: 1,
            speed: 800,
            effect: "fade",
            loop: true,
            autoplay: {
                delay: 5000,
                stopOnLastSlide: false,
            },
            fadeEffect: {
                crossFade: true
            },
            pagination: {
                el: '.main__pagination',
                clickable: true,
            },
            on: {
                init: (swiper) => {
                    let speed = swiper.params.speed;
                    let autoplaySpeed = swiper.params.autoplay.delay;
                    $(swiper.pagination.el).css('--counting-speed', (speed + autoplaySpeed) + "ms");
                }
            }
        })
    }

    if ($('.products-slider').length > 0) {
        $('.products-slider').each(function (index, slider) {

            let prev = $(slider).find('.products-slider__prev')[0];
            let next = $(slider).find('.products-slider__next')[0];

            new Swiper(slider, {
                slidesPerView: "auto",
                spaceBetween: 20,
                speed: 800,
                navigation: {
                    nextEl: next,
                    prevEl: prev
                }
            })
        });
    }

    if ($('.product-card__slider').length > 0) {
        new Swiper('.product-card__slider', {
            slidesPerView: 1,
            speed: 800,
            effect: "fade",
            loop: true,
            navigation: {
                nextEl: '.product-card__next',
                prevEl: '.product-card__prev'
            }
        })
    }

    if ($('.certs__slider').length > 0) {

        let thumbsSlider = new Swiper('.certs__thumbs-slider', {
            slidesPerView: "auto",
            spaceBetween: 4
        })

        let mainSlider = new Swiper('.certs__main-slider', {
            slidesPerView: 1,
            effect: "fade",
            speed: 800,
            fadeEffect: {
                crossFade: true
            },
            navigation: {
                nextEl: ".certs__slider-next",
                prevEl: ".certs__slider-prev",
            },
            thumbs: {
                swiper: thumbsSlider
            }
        });

    }


    // Range Slider

    const rangeFilters = document.querySelectorAll('.range-filter');

    if (rangeFilters.length > 0) {
        rangeFilters.forEach(rangeFilter => {

            const rangeSlider = rangeFilter.querySelector('.range-filter__slider');
            const startInput = rangeFilter.querySelector('.range-filter__input_start');
            const startInputValue = rangeFilter.querySelector('.range-filter__value_start');
            const endInput = rangeFilter.querySelector('.range-filter__input_end');
            const endInputValue = rangeFilter.querySelector('.range-filter__value_end');
            const inputs = [startInput, endInput];
            startInputValue.innerHTML = startInput.value;
            endInputValue.innerHTML = endInput.value;


            noUiSlider.create(rangeSlider, {
                start: [startInput.value, endInput.value],
                connect: true,
                step: +startInput.getAttribute('step'),
                range: {
                    'min': [+startInput.getAttribute('min')],
                    'max': [+endInput.getAttribute('max')]
                }
            });


            rangeSlider.noUiSlider.on('update', function (values, handle) {
                inputs[handle].value = Math.round(values[handle]);
                // console.log(inputs[handle]);
                updateValue(inputs[handle])
            });

            const setRangeSlider = (i, value) => {
                let arr = [null, null];
                arr[i] = value;
                rangeSlider.noUiSlider.set(arr);

            };

            inputs.forEach((el, index) => {

                el.addEventListener('change', (e) => {
                    setRangeSlider(index, e.currentTarget.value);


                });
            });

            inputs.forEach(input => {
                input.addEventListener('input', (e) => {
                    updateValue(e.target);
                })
            });

            function updateValue(input) {


                if (input.value.length >= input.max.length) {
                    input.value = input.value.slice(0, input.max.length)
                }

                if (input == startInput) {
                    startInputValue.innerHTML = input.value;
                }

                if (input == endInput) {
                    endInputValue.innerHTML = input.value;
                }
            }



        })
    };



    // animation

    // add background header on scroll
    const $header = $('.header');

    const callback = function (entries, observer) {
        if (entries[0].isIntersecting) {
            $header.removeClass('header_scroll')
        } else {
            $header.addClass('header_scroll');
        }
    };

    const headerObserver = new IntersectionObserver(callback);
    headerObserver.observe($header[0]);


    // parallax items
    const $animItems = $('[data-animate]');

    if ($animItems.length > 0) {

        $(document).on('scroll', function () {
            footerParallax();
            animOnScroll();
        });


        function animOnScroll() {

            for (let i = 0; i < $animItems.length; i++) {
                const AnimItem = $animItems[i];
                const animHeight = $(AnimItem).height();
                const animOffset = $(AnimItem).offset().top.toFixed(0);


                if ($(AnimItem).data('animate') == 'banner') {
                    if ((scrollY > animOffset) && scrollY < (animOffset + animHeight)) {

                        let scrollPrecentIntoBlock = (((scrollY - animOffset) / animHeight) * 100).toFixed(0);
                        if (scrollPrecentIntoBlock > 100) {
                            scrollPrecentIntoBlock = 100;
                        }
                        if (scrollPrecentIntoBlock < 0) {
                            scrollPrecentIntoBlock = 0;
                        }
                        $(AnimItem).css('--scroll-precent', scrollPrecentIntoBlock)

                    }
                }

                if ($(AnimItem).data('animate') == 'line') {
                    if (scrollY > (animOffset - (animHeight / 1.25))) {
                        $(AnimItem).addClass('active');
                    }
                }


                if ($(AnimItem).data('animate') == 'parallax') {
                    if ((scrollY + animHeight) > animOffset) {

                        let scrollPrecentIntoBlock = (((scrollY + animHeight - animOffset) / animHeight) * 100).toFixed(0);
                        if (scrollPrecentIntoBlock < 0) {
                            scrollPrecentIntoBlock = 0;
                        }
                        $(AnimItem).css('--scroll-precent', scrollPrecentIntoBlock)

                    }

                }

            }





            // function animOnScroll() {

            //     for (let i = 0; i < $animItems.length; i++) {
            //         const AnimItem = $animItems[i];
            //         const animHeight = AnimItem.offsetHeight;
            //         const animOffset = offset(AnimItem).top - 2;
            //         const animStart = 1;

            //         let animItemPoint = window.innerHeight - animHeight / animStart;
            //         if (animHeight > window.innerHeight) {
            //             animItemPoint = window.innerHeight - window.innerHeight / animStart;
            //         }

            //         if ((scrollY > animOffset - animItemPoint) && scrollY < (animOffset + animHeight)) {
            //             AnimItem.classList.add('active');
            //         } else {
            //             AnimItem.classList.remove('active');
            //         }
            //     }
            // }

        }
        var $window = jQuery(window),
            $footer = jQuery(".footer"),
            $viewport = window.innerHeight,
            $startEffect = $footer.offset().top,
            $prev = $footer.prev(),
            $useStartEffect = $startEffect < $viewport;


        function footerParallax() {
            var $scrollPos = $window.scrollTop() - $startEffect,
                $ratio = 0.6;

            var prevOffset = $prev.offset().top + $prev.height() - $window.scrollTop();
            var marginTop = 0;

            if (prevOffset < $viewport && prevOffset < $startEffect) {
                if ($useStartEffect) {
                    marginTop = (prevOffset - $startEffect) * $ratio;
                } else {
                    marginTop = (prevOffset - $viewport) * $ratio;
                }
            }

            $footer.css({
                "margin-top": marginTop + 'px'
            });
        }

        animOnScroll();
        footerParallax();
    }



    // init Smooth Scroll

    SmoothScroll({
        animationTime: 800,
        stepSize: 75,
        accelerationDelta: 30,
        accelerationMax: 2,
        keyboardSupport: true,
        arrowScroll: 50,
        pulseAlgorithm: true,
        pulseScale: 4,
        pulseNormalize: 1,
        touchpadSupport: true,
    })

    // 







});


