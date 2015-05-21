var express = require('express');
var URL = require('../controllers/url');
var USERS = require('../controllers/users');
var router = express.Router();
 


	var url = new URL();
    var users = new USERS();
 

	router.get('/', function(req, res) {res.render('login', { title: 'Express' });});

	router.get('/LinkIt', users.checkIfSessionValid , users.goToMainPage);

	router.get('/checkIfNewArrived',  url.checkIfNewArrived);

    router.get('/getAll',  url.getAll);

	router.get('/validateUrl',  url.validateUrl);

	router.put('/delete',  url.deleteNode);

	router.get('/register',  users.Register);

    router.get('/doLogin',  users.authenticate);
	
	router.put("/logout", users.logoutUser);

	router.put("/increaseCounter", url.counterUp);

	router.put("/decreaseCounter", url.counterDown);

	module.exports = router;


 