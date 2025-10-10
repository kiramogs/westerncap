
  
        $(document).ready(function() {
            $(window).scroll(function() {
                var scroll = $(window).scrollTop();
                if (scroll > 50) {
                    $(".header-1").addClass('scrolled-down').addClass('header-shadow').removeClass('scrolled-top');

                };
                if (scroll < 50) {
                    $(".header-1").addClass('scrolled-top').removeClass('scrolled-down').removeClass('header-shadow');

                };
                if (scroll > 50) {
                    $(".header-2").addClass('header-shadow');

                };
                if (scroll < 50) {
                    $(".header-2").removeClass('header-shadow');

                }
                
            })
        });
   

  
        $('.multiple-items').slick({
            infinite: true,
            slidesToShow: 5,
            slidesToScroll: 5,
            dots: true,
            arrows: false,
            autoplay: true,
            autoplaySpeed: 2000,
            responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            }, {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }, {
                breakpoint: 480,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            }]
        });
   
  
        $('.testimonial-slide').slick({
            infinite: true,
            slidesToShow: 3,
            slidesToScroll: 3,
            dots: true,
            arrows: false,
            autoplay: true,
            autoplaySpeed: 2000,
            responsive: [{
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            }, {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }]
        });
   
  
        $('.meet-team').slick({
            slidesToShow: 4,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            autoplay: true,
            autoplaySpeed: 2000,
            responsive: [{
                breakpoint: 1200,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                }
            }, {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }]
        });
   
  
        AOS.init();
   
  
   
   
  
        $(document).ready(function() {


            $(".dropdown-toggle").mouseenter(function() {
                $('.dropdown-menu').addClass("show-dropdown");
            });
            $(".dropdown-menu").mouseleave(function(e) {
                var value = $(".dropdown-menu").length;
                if ($(e.target).closest(".dropdown-menu").length === 1) {
                    $('.dropdown-menu').removeClass("show-dropdown");

                }
            });
        });
   
  
          $(document).ready(function() {
            $(".navbar-toggler").click(function() {
                $('.navbar').toggleClass("bg-white");
                $('.header-1 .scrolltop').toggleClass("d-none");
                $('.header-1 .scrolldown').toggleClass("d-block");
                $('.fa-bars').toggleClass("text-dark");
                $('.blue').toggleClass("d-none");
                $('.white').toggleClass("d-none");

            });
        });
        $(document).ready(function() {
            $('.address-2').hide();
            $(".address-link-2").click(function() {
                $('.address-2').show();
            });
            $(".address-link-1").click(function() {
                $('.address-2').hide();
            });
        });
   
        $(document).ready(function() {
            
            $(".carousel-control-next").click(function() {
                $('.fadeInRight').fadeIn().fadeOut().fadeIn();
            });
            $(".carousel-control-prev").click(function() {
                $('.fade-out').removeClass('animate__animated').fadeOut().fadeIn();
            });
        });

        $(document).ready(function() {
            $(document).on("click","#contact-submit",function(e){

                let full_name = $("#full_name").val();
                let phone = $("#phone").val();
                let email = $("#email").val();
                let message = $("#message").val();
                $('.input-txt').removeClass('text-error')
                $('.input-error').text('')
                let error = 0
                let fullNameError = validateInput(full_name)
                if(fullNameError != ""){
                    $("#full_name").addClass('text-error')
                    $('.full-name-error').text(fullNameError)
                    error++;
                }
                // let phoneError = validateInput(phone)
                // if(phoneError != ""){
                //     $("#phone").addClass('text-error')
                //     $('.phone-error').text(phoneError)
                //     error++;
                // }
                let emailError = validateEmail(email)
                if(emailError != ""){
                    $("#email").addClass('text-error')
                    $('.email-error').text(emailError)
                    error++;
                }
                let msgError = validateInput(message)
                if(msgError != ""){
                    $("#message").addClass('text-error')
                    $('.message-error').text(msgError)
                    error++;
                }
                let phoneError = validatephone(phone)
                  if(phoneError != ""){
                      $("#phone").addClass('text-error')
                      $('.phone-error').text(phoneError)
                      error++;
                  }
                if(error == 0){
                    let requestValues = {
                        'full_name':full_name,
                        'phone':phone,
                        'email':email,
                        'message':message 
                    }

                    $.ajax({
                        url: "/api/send-contact-mail",
                        type: "post",
                        dataType: "json",
                        data: requestValues,
                        success: function (response) {
                            // Handle both JSON object and string for safety
                            try {
                                if (typeof response === 'string') {
                                    response = JSON.parse(response);
                                }
                            } catch (_) {}
                            if (response && response.success === true) {
                                $('.success-message').text('We have received your response and will get back to you shortly.').removeClass('d-none');
                                $(".input-txt").val('')
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                           console.log(textStatus, errorThrown);
                        }
                    });
                }
            });
        });

        function validateInput(textInput){
            let errors = '';
            if(textInput === undefined){
                errors= 'Please enter required value'
            }
            else if(textInput !== undefined && (textInput).trim().replace(/ /g, "") ==""){
                errors= 'Please enter required value'
            }
            return errors;

        }

        function validatephone(phone)
        {
            let errors = '';
            var regx = /^[6-9]\d{9}$/ ;
            if(phone === undefined){
                errors= 'Please enter required value'
            }
            else if(phone !== undefined && (phone).trim().replace(/ /g, "") ==""){
                errors= 'Please enter required value'
            }
            else if(phone !== undefined &&  !regx.test(phone)){
                errors= 'Please enter valid phone'
            }
            return errors;
          
        }

    function validateEmail(accountEmail){
        let errors = '';
        let reg = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i
        
        if(accountEmail === undefined){
            errors= 'Please enter required value'
        }
        else if(accountEmail !== undefined && (accountEmail).trim().replace(/ /g, "") ==""){
            errors= 'Please enter required value'
        }
        else if(accountEmail !== undefined && !reg.test(accountEmail)){
            errors= 'Please enter valid email'
        }

        return errors;
    }
    
