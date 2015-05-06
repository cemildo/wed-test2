var fs = require("fs");
var db = require("../db/urls.json");


function DB (){
   this.insert = function ( obj ){
      
      db.unshift(obj);

		fs.writeFile(  "db/urls.json" , JSON.stringify( db , null , 4), "utf8", function(){ });
      return "success"
   }

   this.update = function (){

   }

   this.deleteNode =function ( id ){

      // Array Remove - By John Resig (MIT Licensed)
      Array.prototype.remove = function(from, to) {
        var rest = this.slice((to || from) + 1 || this.length);
        this.length = from < 0 ? this.length + from : from;
        return this.push.apply(this, rest);
      };

      var db = require("../db/urls.json"); 
      fs.writeFile( "db/urls.json"  , JSON.stringify( [] , null , 4), "utf8", function(){ });

      for(elm in db){
        
         if(db[elm].id == id)
         { 
             
            db.remove(elm);
           
            fs.writeFile( "db/urls.json"  , JSON.stringify( db , null , 4), "utf8", function(){ });
         }
      }
      
      return "success";
   }

   this.contains = function ( byurl ){
      
      var db = require("../db/urls.json"); 
      for(elm in db){
        
         if(db[elm].url === byurl)
         {
            return true;
         }
      }
      return false;
 
   }

   this.getAll = function (){
     return require("../db/urls.json");
   }

}


exports = module.exports = DB;