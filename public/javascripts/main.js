 var app = app || {};

(function($) {

   $.notify.defaults( {globalPosition: 'bottom right',} )


 

   $(document).ready(function(){
     $("div.urlLinks button").css( "display","none" );
     app.getAll ();
     setInterval(function () { app.checkIfNewArrived();}, 1000);
   });



   app.checkIfNewArrived = function (){
       var numberOfChild = $("#savedList").children().length;
       app.ajax("/checkIfNewArrived", numberOfChild ,function (data){
          if(data.newUpdates){
            app.getAll ();
          }
            
     });
   }

   app.getAll = function (){
     app.ajax("/getAll", "" ,function (data ){
      var html ="<span></span>";
      for(index in data.obj){
        html += app.renderHtml(data.obj[index]);
      }
      $("#savedList").html(html);
      app.addMouseInOutHandler ();
      data = null;
    });
   }

   app.postUrl = function (   ){
   	 var inputValue = $('#linkInput').val().trim();
     app.ajax("/validateUrl", inputValue ,function (data){ 

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

   app.ajax = function (func , link ,call){
   		$.ajax({
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
     
   	  app.ajax("/delete", id ,function (data) {
      	  $("#"+id).remove(); 
          $.notify("Url has been deleted!", "info");
      })
   }

  app.logout = function (){
     
      app.ajax("/logout", "empty" ,function (data) {
          window.location = data.url;
      })
  }

  app.increaseCounter = function ( id ){
      app.ajax("/increaseCounter", id ,function (data) {
          $("#"+id+" #point").html(data.point);
          $.notify(data.message, "info");
      })

  }

  app.decreaceCounter = function ( id ){
      app.ajax("/decreaseCounter", id ,function (data) {
          $("#"+id+" #point").html(data.point);
          $.notify(data.message, "info");
      })
  }

   

}(jQuery));	