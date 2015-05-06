 var app = app || {};

$(function() {

   



   $('#addLink').on('click', function(){ app.postUrl(); })
   

   $(document).ready(function(){
     $("div.urlLinks button").css( "display","none" );
     app.getAll ();
     setInterval(function () { app.getAll ();}, 1000);
   });

   app.getAll = function (){
     app.ajax("/getAll", "" ,function (data ){
      var html ="<span></span>";
      for(index in data.obj){
        html += app.renderHtml(data.obj[index]);
      }
      $("#savedList").html(html);
      app.addMouseInOutHandler ();
    });
   }

   app.postUrl = function (   ){
   	 var inputValue = $('#linkInput').val();
     app.ajax("/validateUrl", inputValue ,function (data){
       $("#savedList").prepend(app.renderHtml(data.obj));
       app.addMouseInOutHandler ();
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
      	  $("#"+id).parent().remove(); 
      })
   }

});	