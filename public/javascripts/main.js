$(function() {

    var app = {};



   $('#addLink').on('click', function(){ app.postUrl(); })
   $("#savedList button").on("click", function (){ app.delete( $(this))})

   app.postUrl = function (   ){
   	 var inputValue = $('#linkInput').val();
     app.ajax("/validateUrl", inputValue ,function (data){
 		$("#savedList").prepend('<li class="list-group-item">'+data.obj.name+' Website '+data.obj.url+'<button class="btn btn-default btn-sm" type="submit">delete</button></li>');
     });
    	  

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

   app.delete = function ( that ){
   	  var id = that.parent().attr("id");
     
      app.ajax("/delete", id ,function (data) {
      	  $("#"+id).remove(); 
      })
   }

});	