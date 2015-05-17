
var DB = require('../controllers/database');


function Users (){

	
	var db = new DB();
	var that = this;
	var dbPath = "db/users.json" ;

     
    this.Register = function (req,res, next ){
        
        if(that.validate(req,res)){

            var user = {
                  username: req.query.obj.username,
                  date: new Date(),
                  id : new Date().getTime(),
                  email: req.query.obj.email ,
                  pass : req.query.obj.pass
            };

            if(db.insert(dbPath, user) === "success") 
                res.send({ status: 'success', username : user.username });
            else
                res.send({status: "error" })
             
            
        }else{
            res.send({status: "error" })
        }
        
 
    }

    this.validate = function (req,res){
        var username  =  req.query.obj.username;
        var email     =  req.query.obj.email;
        var pass      =  req.query.obj.pass;
        var repass    =  req.query.obj.repass;
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
       
        if( pass != repass || pass == null || pass.length == 0 || repass == null || repass.length == 0){
             res.send({status: "error", message : "passwords dont match!" });
             return false;
        }

        if( !re.test(email)){
             res.send({status: "error", message : "Not a valid email address!" });
             return false;
        }

        if( username == null || username.length == 0){
            res.send({status: "error", message : "Not a valid username!" });
            return false; 
        }
        return true;

    }

    this.authenticate = function (req,res){
        var username  =  req.query.obj.username;
        var password  =  req.query.obj.password;

        db.getOneByUserName(dbPath, username, function (data) { 
            
             if(data == null){
                res.send({status: "error", message: "No user has been found!" });
                return;
             }

             if(data.pass == password){
                req.session.valid = true;
                req.session.user = data;
                res.send({status: "success", message: "you are authenticated!" , url : "/main"});
             }
             else
                res.send({status: "error", message: "Check your password again!" });
        }) 
        

       
    }

    this.checkIfSessionValid = function (req,res, next ){
          if(req.session.valid){
            res.render('main', {"name" : req.session.user.username});
          }
          else{
            res.render('login', {});
          }
          
    }

    this.logoutUser = function (req,res){

        req.session.valid = false;
        res.send({status: "success", message: "you are logged out!" , url : "/"});
    }

    
    

}


exports = module.exports = Users;