$(document).ready(function() {
    // focusout behavior-----------------------------------------------------------------------
    $('#contact_first_name').on('focusout', function() {
        var input = $(this);
        var test = input.val();
        if(test){
            input.removeClass("invalid").addClass("valid");
            $('span', input.parent()).removeClass('error_show').addClass('error');
        }
        else{input.removeClass("valid").addClass("invalid");}
    });

    $('#contact_last_name').on('focusout', function() {
        var input = $(this);
        var test = input.val();
        if(test){
            input.removeClass("invalid").addClass("valid");
            $('span', input.parent()).removeClass('error_show').addClass('error');    
        }
        else{input.removeClass("valid").addClass("invalid");}
    });
    
    $('#contact_birth_date').on('focusout', function() {
        var input=$(this);
        var re = /^\d{2}\/\d{2}\/\d{4}/;
        var test = re.test(input.val());
        if(test) {
            input.removeClass("invalid").addClass("valid");
            $('span', input.parent()).removeClass('error_show').addClass('error');
        } else{input.removeClass("valid").addClass("invalid");}
    });

    $('#contact_email').on('focusout', function() {
        var input=$(this);
        var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        var test=re.test(input.val());
        if(test){
            input.removeClass("invalid").addClass("valid");
            $('span', input.parent()).removeClass('error_show').addClass('error');
        }
        else{input.removeClass("valid").addClass("invalid");}
    });

    $('#contact_phone').on('focusout', function() {
        var input=$(this);
        var re = /^\(\d{2}\)9[1-9]\d{3}-\d{4}/;
        var test=re.test(input.val());
        if(test){
            input.removeClass("invalid").addClass("valid");
            $('span', input.parent()).removeClass('error_show').addClass('error');
        }
        else{input.removeClass("valid").addClass("invalid");}
    });

    $('#contact_cpf').on('focusout', function() {
        var input = $(this);
        var re = /^\d{3}\.\d{3}\.\d{3}-\d{2}/;
        var mask_test = re.test(input.val());
        var cpf_test = validateCPF(input.val());
        if(mask_test && cpf_test){
            input.removeClass("invalid").addClass("valid");
            $('span', input.parent()).removeClass('error_show').addClass('error');
        }
        else{input.removeClass("valid").addClass("invalid");}
    });
    //----------------------------------------------------------------------------------------

    // input behavior-------------------------------------------------------------------------
    $("#contact_birth_date").on("input", function() {
        var v = this.value;
        
        // prevents from entering non number input
        if(isNaN(v[v.length-1])){ 
            this.value = v.substring(0, v.length-1);
            return;
        }
        
        this.setAttribute("maxlength", "10");
        if (v.length == 2 || v.length == 5) this.value += "/";
    });

    $("#contact_phone").on("input", function() {
        var v = this.value;
        
        // prevents from entering non number input
        if(isNaN(v[v.length-1])){
            this.value = v.substring(0, v.length-1);
            return;
        }
        
        this.setAttribute("maxlength", "14");
        if (v.length == 1) this.value = "(" + this.value;
        if (v.length == 3) this.value = this.value += ")";
        if (v.length == 9) this.value = this.value += "-";
    });

    $("#contact_cpf").on("input", function() {
        var v = this.value;
        
        // prevents from entering non number input
        if(isNaN(v[v.length-1])){
            this.value = v.substring(0, v.length-1);
            return;
        }
        
        this.setAttribute("maxlength", "14");
        if (v.length == 3 || v.length == 7) this.value += ".";
        if (v.length == 11) this.value += "-";
    });
    //-------------------------------------------------------------------------------------------

    // checkbox and radio click behavior-------------------------------------------------------------------
    $("#contact_sms_checker").on("click", function() {
        if($('#contact_sms_checker').is(':checked') == false) {
            $('#phone_block').hide()
            $('#contact_phone').val('')
            $('#contact_phone').removeClass("invalid").addClass("valid");
        } else {
            $('#phone_block').show()
            $('#contact_phone').removeClass("valid").addClass("invalid");
        }
    });

    $("#contact_cliente_avanti_no").on("click", function() {
        if($(this).is(':checked')) {
            $('#cpf_block').hide()
            $('#contact_cpf').val('')
            $('#contact_cpf').removeClass("invalid").addClass("valid");

        }
    });

    $("#contact_cliente_avanti_yes").on("click", function() {
        if($(this).is(':checked')) {
            $('#cpf_block').show()
            $('#contact_cpf').removeClass("valid").addClass("invalid");

        }
    });
    //------------------------------------------------------------------------------------------

    // forms submission
    $("#contact_submit").click(function(event){
        event.preventDefault();
        

        // verify privacy policy
        if(!$('#contact_privacy_policy_checker').is(':checked')) {
            alert('Para se cadastrar é necessário concordar com a política de privacidade.')
            return
        }
        if(!$('#contact_cliente_avanti_no').is(':checked') && !$('#contact_cliente_avanti_yes').is(':checked')) {
            alert('Por favor, marque se você é ou não é um torcedor Avanti.')
            return
        }

        // verify inputs content
        var form_data = $('#contact-form').serializeArray();
        var error_free = true;

        for(var i = 0; i < form_data.length; i++) {
            var name = form_data[i]['name'];
            if(name.search('checker') != -1 || name.search('radio') != -1) {
                continue;
            } else if(name == 'phone') {
                if(form_data[i - 1]['name'].search('checker') == -1){
                    continue;
                }
            } else if(name == 'cpf') {
                if($('#contact_cliente_avanti_no').is(':checked')){
                    continue;
                }
            }
            var element = $('#contact_' + name);
            var invalid = element.hasClass('invalid');
            var error_element = $('span', element.parent());
            if(invalid) {
                error_element.removeClass('error').addClass('error_show');
                error_free = false;
            } else {
                error_element.removeClass('error_show').addClass('error');
            }
        }

        if(!error_free) {
            return
        } else {
            // ajax script
            // getting link parameters
            var self = window.location.toString();
            var querystring = self.split("?");
            if (querystring.length > 1) {
                var pairs = querystring[1].split("&");
                for (i in pairs) {
                    var keyval = pairs[i].split("=");
                    if (sessionStorage.getItem(keyval[0]) === null) {
                    sessionStorage.setItem(keyval[0], decodeURIComponent(keyval[1]));
                    }
                }
            }

            var rest_data = {
                'first_name': $('#contact_first_name').val(),
                'last_name': $('#contact_last_name').val(),
                'birth_date': $('#contact_birth_date').val(),
                'email': $('#contact_email').val(),
                'is_sms': $('#contact_sms_checker').is(':checked') ? 'true' : 'false',
                'phone': $('#contact_phone').val(),
                'is_avanti': $('#contact_cliente_avanti_yes').is(':checked') ? 'true' : 'false',
                'cpf': $('#contact_cpf').val(),
                'utm_source': sessionStorage.getItem('utm_source') == null ? '' : sessionStorage.getItem('utm_source'),
                'utm_medium': sessionStorage.getItem('utm_medium') == null ? '' : sessionStorage.getItem('utm_medium'),
                'utm_campaign': sessionStorage.getItem('utm_campaign') == null ? '' : sessionStorage.getItem('utm_campaign'),
                'utm_term': sessionStorage.getItem('utm_term') == null ? '' : sessionStorage.getItem('utm_term'),
                'utm_content': sessionStorage.getItem('utm_content') == null ? '' : sessionStorage.getItem('utm_content')
            };

            $.ajax({
                beforeSend: function() {
                    $('#loader').css('display', 'block')
                },
                url:'https://631a4vkgv4.execute-api.us-east-1.amazonaws.com/test/lead-palmeiras',
                type:'POST',
                dataType:'json',
                contentType:'application/json; charset=utf-8',
                data:JSON.stringify(rest_data),
                success: function() {
                    $('#loader').css('display', 'none') 
                    alert('Cadastro realizado com sucesso!!!')
                    $('input').each(function() {
                        if($(this).is(':text')) {
                            $(this).val('')
                        }
                    });
                },
                error:function() {

                }
            });
             

        }
         
    });

});