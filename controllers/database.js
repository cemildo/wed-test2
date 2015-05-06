var fs = require("fs");



function DB (){
   var that = this;
   this.insert = function ( obj ){
     
      that.readFromFile (function ( db ){
         console.log(db);
         db.push(obj);
         that.writeToFile (db);
      });
      
        
      return "success"
   }

   this.writeToFile = function (db){
      

      var wstream = fs.createWriteStream("db/urls.json");
         wstream.write(JSON.stringify( db , null , 4));
         wstream.end();
   }

   this.readFromFile = function ( call ){
      fs.readFile("db/urls.json", 'utf8', function (err,db) {
        if (err) {
          return console.log(err);
        }

        call (JSON.parse(db));
      });
   }

   this.deleteNode =function ( id ){
      that.readFromFile (function ( db ){
         if(db.length == 0){
            return "success";
         }
         function diffArray (a, b) {
            var diff = [];
            for ( var i = 0; i < a.length; i++)
            {
               if( a[i].id  != b ){
                  diff.push(a[i]);
               }
            }
            return diff;
         }

          
         var diff = diffArray(db,id);
         that.writeToFile(diff);
      }); 
      
      return "success";
   }

   this.contains = function ( byurl ,callback){
      
      that.readFromFile (function ( db ){
         for(elm in db)
         {
            if(db[elm].url === byurl)
            {
               callback(true);
               return;
            }
         }
         callback(false);
      });
   }

   this.getAll = function (callback){
     that.readFromFile (function ( db ){
        callback(db);
     });  
   }

}


exports = module.exports = DB;