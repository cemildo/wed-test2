var fs = require("fs");



function DB (){
   var that = this;
   this.insert = function (dbPath,  obj ){
     
      that.readFromFile (dbPath, function ( db ){
        db.push(obj);
        that.writeToFile (dbPath, db);
      });
      
        
      return "success"
   }

   this.writeToFile = function (dbPath, db){

      var wstream = fs.createWriteStream(dbPath);
         wstream.write(JSON.stringify( db , null , 4));
         wstream.end();
   }

   this.readFromFile = function (dbPath,  call ){
      fs.readFile(dbPath, 'utf8', function (err,db) {
        if (err) {
          return console.log(err);
        }

        call (JSON.parse(db));
      });
   }

   this.deleteNode =function (dbPath,  id ){
      that.readFromFile (dbPath, function ( db ){
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
         that.writeToFile(dbPath, diff);
      }); 
      
      return "success";
   }

   this.getOneByUserName = function (dbPath, username, call ){
      that.readFromFile (dbPath, function ( db ){
         for(elm in db)
         {
            if(db[elm].username === username || db[elm].email === username)
            {
               call(db[elm]);
               return;
            }
         }
         call(null);
      });
   }

   this.contains = function ( dbPath, byurl ,callback){
      
      that.readFromFile (dbPath, function ( db ){
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

   this.getAll = function (dbPath, callback){
     that.readFromFile (dbPath, function ( db ){

        db = db.slice(0);
        db.sort(function(a,b) {
            return b.id - a.id;
        });

        callback(db);
     });  
   }

   this.counterUp = function (dbPath, id , userId, call ){
       that.readFromFile (dbPath, function ( db ){
         var number = 0;
          
         for(elm in db)
         {  
            if(Number(db[elm].id) == Number(id) )
            {
               db[elm].point +=1;
               db[elm].positive.push(userId);
               db[elm].negative.splice(db[elm].negative.indexOf(userId), 1);
               number =  db[elm].point;  
            }
         }
          
         that.writeToFile(dbPath, db);
         call(number);
      });
   }
  
  this.checkIfUserVoted = function (dbPath, urlId, userId, call ){
    var voteStatus = {};
    that.readFromFile (dbPath, function ( db ){
         for(elm in db)
         {
           if(Number(db[elm].id) == Number(urlId) )
            {
               voteStatus.positive = that.isInArray ( db[elm].positive, userId ); 
               voteStatus.negative = that.isInArray ( db[elm].negative, userId ); 
            }
         }
         call(voteStatus);
         
      });

  }

  this.isInArray = function (arr,userId){
    for(i in arr)
    {  
      if( arr[i] == userId )
        return true;
    }

    return false;
  }

  this.counterDown = function (dbPath, id , userId,  call ){
       that.readFromFile (dbPath, function ( db ){
         var number = 0;
         
         for(elm in db)
         {  
            if(Number(db[elm].id) == Number(id) )
            {
               db[elm].point -=1;
               db[elm].negative.push(userId);
               db[elm].positive.splice(db[elm].positive.indexOf(userId), 1);
               number =  db[elm].point;  
            }
         }
          
         that.writeToFile(dbPath, db);
         call(number);
      });
   }
}


exports = module.exports = DB;