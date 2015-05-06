var express = require('express');
var URL = require('../controllers/url');
var router = express.Router();
 


	var url = new URL();


	router.get('/', function(req, res) {
	  res.render('login', { title: 'Express' });
	});

	router.get('/main', function(req, res) {
	  res.render('main', {   });
	});

	router.get('/checkIfNewArrived',  url.checkIfNewArrived);

    router.get('/getAll',  url.getAll);

	router.get('/validateUrl',  url.validateUrl);

	router.get('/delete',  url.deleteNode);

	module.exports = router;


 