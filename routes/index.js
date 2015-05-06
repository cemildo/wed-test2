var express = require('express');
var URL = require('../controllers/url');
var router = express.Router();
 


	var url = new URL();


	router.get('/', function(req, res) {
	  res.render('login', { title: 'Express' });
	});

	router.get('/main', function(req, res) {
	  var links = url.getAll();
	  res.render('main', { links : links });
	});

	router.get('/validateUrl',  url.validateUrl);

	router.get('/delete',  url.delete);

	module.exports = router;


 