var express = require('express');
var URL = require('../controllers/url');
var USERS = require('../controllers/users');
var router = express.Router();
 


	var url = new URL();
    var users = new USERS();
 

	router.get('/', function(req, res) {res.render('login', { title: 'Express' });});

	router.get('/main', users.checkIfSessionValid );

	router.get('/checkIfNewArrived',  url.checkIfNewArrived);

    router.get('/getAll',  url.getAll);

	router.get('/validateUrl',  url.validateUrl);

	router.get('/delete',  url.deleteNode);

	router.get('/register',  users.Register);

    router.get('/doLogin',  users.authenticate);
	
	router.get("/logout", users.logoutUser);

	router.get("/increaseCounter", url.counterUp);

	router.get("/decreaseCounter", url.counterDown);

	module.exports = router;


 