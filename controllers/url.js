var url = require("url");
var DB = require('../controllers/database');


function URL (){

	var ifSomethingUpdated = false;
	var db = new DB();
	var that = this;
	var dbPath = "db/urls.json" ;

    this.validateUrl = function (req,res){
       
        db.contains(dbPath, req.query.url,function ( bool ){
        	if(bool){
        	    res.send({status: "error", message:"This url is already saved!" });
        	}
        	else{
        	    var myRegExp =/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
				var urlToValidate = req.query.url;
				if (!myRegExp.test(urlToValidate)){
                    res.json({status: "error", message: "Not a valid url!" });
				}else{
					that.saveToDb (req,res, urlToValidate);
				}
        	}
            
        })  
        	
        
    	
    }

    this.saveToDb = function (req,res,urlToValidate){
        var urlHostParts = that.parseUrl(urlToValidate)[1].split(".");
		 console.log(req.session.user.username);
        var obj = {
		      name: that.parseHostName ( urlHostParts[0]),
	          url: urlToValidate,
	          date: new Date(),
	          id : new Date().getTime(),
	          owner: req.session.user.username ,
	          point : 0,
	          positive : [],
	          negative : []
		};
		 
        if(db.insert(dbPath, obj) === "success") 
        	res.send({obj: obj,status: "success"});
        else
        	res.send({status: "error" })
 
    }

    this.deleteNode = function (req,res ){
         
    	db.deleteNode(dbPath,req.body.url, req.session.user.username, function ( bool ){
            console.log("cemil" , bool);
            if(bool == true){
                res.send({status: "success" , message: "Selected elemented has been succesfully deleted."});
            }
            if(bool == false){
                res.send({status: "errors" , message: "Selected elemented cannot be deleted."});
            }
        })
    }

    this.getAll = function (req,res){ 
    	 db.getAll(dbPath,function (  allNodes ){
			res.send({obj: allNodes,status:"success"});
    	 });
    }

    this.checkIfNewArrived = function (req, res){
        // in html variable(frontend main.js) we have one more span,
        // otherwise it shows undefined initializing
        //var numberOfElementsInFrontend = req.query.url - 1; 
        var clientData = req.query.url || 0;

        db.getAll(dbPath, function ( db ){
            if(db.length != clientData.length){
               res.send({newUpdates: true ,status:"success"}); 
               return;
            }

            for(i in clientData){
                for(k in db){
                    if(clientData[i].id == db[k].id ){
                        if(clientData[i].point != db[k].point ){
                        res.send({newUpdates: true ,status:"success"});
                        return; 
                    } 
                    }
                }
            }

         	res.send({newUpdates: false ,status:"success"});
        });
    }

    this.parseHostName = function (  hostName ){
    	return hostName.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })  
    }

    this.parseUrl =  function  (urlString) {
    	 return urlString.match(/:\/\/(?:www\.)?(.[^/]+)(.*)/);
    }

    this.counterUp   = function (req,res){
     
       db.checkIfUserVoted (dbPath, req.body.url, req.session.user.id, function ( voteStatus ){ 
           if(!voteStatus.positive){
                db.counterUp(dbPath ,req.body.url,req.session.user.id, function ( number ){

                    res.send({status: "success", message: "you have increased the point of element!" , point : number });

                });
            }
            else
              res.send({status: "success", message: "You have already voted for this post"  });  
        } ) 
       
    }

    this.counterDown = function (req,res){
        db.checkIfUserVoted (dbPath, req.body.url, req.session.user.id, function ( voteStatus ){ 
           if(!voteStatus.negative){
                db.counterDown(dbPath,req.body.url,req.session.user.id,function ( number ){
                    
                    res.send({status: "success", message: "you have decreased the point of element!" , point : number });

                });
            }
            else
              res.send({status: "success", message: "You have already voted for this post"  }); 
        } ) 
         
    }

}


exports = module.exports = URL;