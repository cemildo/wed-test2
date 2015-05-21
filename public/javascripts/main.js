 var app = app || {};

(function($) {

   $.notify.defaults( {globalPosition: 'bottom right',} )

   
 

   $(document).ready(function(){
     $("div.urlLinks button").css( "display","none" );
     app.getAll ();
     setInterval(function () { app.checkIfNewArrived();}, 1000);
   });



   app.checkIfNewArrived = function (){
        app.ajax("/checkIfNewArrived", app.data ,"GET",function (data){
          if(data.newUpdates){
            app.getAll ();
          }
            
     });
   }

   app.getAll = function (){
     app.ajax("/getAll", "" ,"GET",function (data ){
      var html ="<span></span>";
      for(index in data.obj){
        html += app.renderHtml(data.obj[index]);
      }
      $("#savedList").html(html);
      app.addMouseInOutHandler ();
      app.data = data.obj;
      data = null;
    });
   }

   app.postUrl = function (   ){
   	 var inputValue = $('#linkInput').val().trim();
     app.ajax("/validateUrl", inputValue ,"GET",function (data){ 

      if(data.status == "success"){
        $("#savedList").prepend(app.renderHtml(data.obj));
        app.addMouseInOutHandler ();
         
        $.notify("Url has been saved!", "success");
      }
      else{
        $.notify(data.message, "error");
      }
       
     });
    	  

   }

   app.addMouseInOutHandler = function (){
    $("div.urlLinks").bind("mouseenter", function() { 
      $( this ).find( "button" ).css( "display","block" );
      })
      .bind("mouseleave",function() {
      $( this ).find( "button" ).css( "display","none" );
    });
   }
  
   app.renderHtml = function (data){

     var source   = $("#url-template").html();
     var template = Handlebars.compile(source);
     return template(data);
   }

   app.ajax = function (func , link ,methode, call){
   		$.ajax({
        type: methode,
			  url: func,
			  cache: false,
			  data: { "url":link},
			  success: function(data){
			  	 if(data.status === "success")
			  	   call( data) ;
			  }
		});
   }

   app.delete = function ( id ){
   	  app.ajax("/delete", id ,"PUT",function (data) {
         
        if(data['status'] == 'success'){
      	  $("#"+id).remove();
          $.notify(data.message, "info");
        }
        else{
          $.notify(data.message, "info");
        }; 
          
      })
   }

  app.logout = function (){
     
      app.ajax("/logout", "empty" ,"PUT", function (data) {
          window.location = data.url;
      })
  }

  app.increaseCounter = function ( id ){
      app.ajax("/increaseCounter", id ,"PUT", function (data) {
          $("#"+id+" #point").html(data.point);
          $("#"+id+" #point").addClass("boxin");
          setTimeout(function(){ 
              $("#"+id+" #point").removeClass("boxin");
           }, 1000);
          
          $.notify(data.message, "info");
      })

  }

  app.decreaceCounter = function ( id ){
      app.ajax("/decreaseCounter", id ,"PUT", function (data) {
          $("#"+id+" #point").html(data.point);
          $("#"+id+" #point").addClass("boxin");
          setTimeout(function(){ 
              $("#"+id+" #point").removeClass("boxin");
           }, 1000);
          $.notify(data.message, "info");
      })
  }

   

}(jQuery));	