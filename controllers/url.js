var url = require("url");
var DB = require('../controllers/database');


function URL (){

	
	var db = new DB();
	var that = this;
	

    this.validateUrl = function (req,res){
       
        db.contains(req.query.url,function ( bool ){
        	console.log(bool);
        	if(bool){
        	    res.send({status: "error" });
        	}
        	else{
        	    var myRegExp =/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
				var urlToValidate = req.query.url;
				if (!myRegExp.test(urlToValidate)){
				    res.send("Not a valid URL.");
				}else{
					that.saveToDb (req,res, urlToValidate);
				}
        	}
            
        })  
        	
        
    	
    }

    this.saveToDb = function (req,res,urlToValidate){
        var urlHostParts = that.parseUrl(urlToValidate)[1].split(".");
		 
        var obj = {
		      name: that.parseHostName ( urlHostParts[0]),
	          url: urlToValidate,
	          date: new Date(),
	          id : new Date().getTime(),
	          owner: "Cemil " ,
	          point : 0,
	          positive : [],
	          negative : []
		};
		 
        if(db.insert(obj) === "success") 
        	res.send({obj: obj,status: "success"});
        else
        	res.send({status: "error" })
 
    }

    this.deleteNode = function ( req,res  ){
    	  
    	if(db.deleteNode(req.query.url) === "success") 
        	res.send({status: "success" });
        else
        	res.send({status: "error" })
    }

    this.getAll = function (req,res){
    	 db.getAll(function ( allNodes ){
			res.send({obj: allNodes,status:"success"});
    	 });
    }

    this.checkIfNewArrived = function (req, res){
        // in html variable(frontend main.js) we have one more span,
        // otherwise it shows undefined initializing
        var numberOfElementsInFrontend = req.query.url - 1; 

        db.getAll(function ( db ){
            
         	if(db.length != numberOfElementsInFrontend)
         	 res.send({newUpdates: true ,status:"success"});
            else	
         	 res.send({newUpdates: false ,status:"success"});
        }) ;
    }

    this.parseHostName = function (  hostName ){
    	return hostName.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })  
    }

    this.parseUrl =  function  (urlString) {
    	 return urlString.match(/:\/\/(?:www\.)?(.[^/]+)(.*)/);
    }

}


exports = module.exports = URL;