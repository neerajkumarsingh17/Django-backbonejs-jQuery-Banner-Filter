var nTimer = setInterval(function() {
        if (window.jQuery) {

			$(document).ready(function() {

				//toggle to collapse and expand -Start
				$('#custom-help-header').on('click', function(){
					$('#help-desc').val('');
					if($(this).parent().hasClass('custom-help-collapsed')){
						$(this).parent().removeClass('custom-help-collapsed').addClass('custom-help-expanded');
					}else{
						$(this).parent().removeClass('custom-help-expanded').addClass('custom-help-collapsed');
					}
				});
				//toggle to collapse and expand -end

				//submit help box button-Start
				$('#help-button-submit').on('click', function(){
					var help_subject = $.trim($('#help-subject').val());
					var help_desc = $.trim($('#help-desc').val());
					
					//TODO : For empty validation
					if(help_subject.length == 0 || help_desc.length == 0){
						return false;
					}

					if(!validateString(help_subject) == true){
						$('#help-subject').addClass('help-error');
						$('.help-error-msg').removeClass('show-hide-load');
						return false;
					}else if(!validateString(help_desc) == true){
						$('#help-desc').addClass('help-error');
						$('#help-subject').removeClass('help-error');
						$('.help-error-msg').removeClass('show-hide-load');
						return false;
					}else{
						$('#help-subject, #help-desc').removeClass('help-error');
						$('.help-error-msg').addClass('show-hide-load');
						$('#custom-help-form').addClass('show-hide-load');
						$('#help-submit-loader').removeClass('show-hide-load');
						console.log("Here 0");
						$.ajax({
					        url: "/helpemail",
					        method: "post",
					        data: {
					        	'help_desc':help_desc,
					        	'help_subject':help_subject
					        },
					        success: function(response){
					        	var json = $.parseJSON(response);
					            $('#help-submit-loader').addClass('show-hide-load');
					            $('#custom-help-success').removeClass('show-hide-load');
					            setTimeout(function(){
					            	$('#custom-need-help').removeClass('custom-help-expanded').addClass('custom-help-collapsed');
					            	$('#custom-help-form').removeClass('show-hide-load');
					            	$('#custom-help-success').addClass('show-hide-load');
					            	$('#help-subject').val('');
					            	$('#help-desc').val('');
					            }, 6000);
					        },
					        error : function(xhr, status, error) {
					        	console.log(xhr, status, error, '===Ajax Failed===');
					        }
					    });
					}
				});
				//submit help box button-end

			});
	clearInterval(nTimer);
	}
}, 100);


//validation function for subject
function validateString(inputStr) {
	return true;
	inputStr = $.trim(inputStr);
	return /^[0-9a-zA-Z \n\.\']+$/.test(inputStr);
}