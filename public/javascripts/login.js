var login = login || {};

$(function() {

    $('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});

	login.ajax = function (func , obj ,call){
   		$.ajax({
			  url: func,
			  cache: false,
			  data: { "obj": obj},
			  success: function(data){
			  	  call( data) ;
			  }
		});
    }

    $("#register-form").submit(function (evt) {
        evt.preventDefault();

	    var obj = {	
		       username : $("#uname").val(),
		       email    : $("#email").val(),
		       pass     : $("#pass").val(),
		       repass   : $("#repass").val()
	       }	
	   
	   	login.ajax("/register", obj ,function (data) {
	      	  if(data.status === "success"){
	      	  	$("#username").val(data.username);
	      	  	$('#login-form-link').click();
	      	  	$.notify("User has been created. Please provide credentials!", "success")
	      	  }
	      	  else{
	      	  	$.notify( data.message , "error");
	      	  }

	      	  
      	})
	});

	
    $("#login-form").submit(function (evt) {
        evt.preventDefault();

	    var obj = {	
		       username : $("#username").val(),
		       password : $("#password").val()
	       }	
	   
	   	login.ajax("/doLogin", obj ,function (data) {
	      	  if(data.status === "success"){
	      	  	 window.location = data.url;
	      	  }
	      	  else
	      	  	$.notify("Please check credentials and try again!","info");

	      	  
      	})
	});
  
    

});
