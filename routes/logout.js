'use strict';

var express = require("express");
var app     = express.Router();
var passport = require('passport');

app.get('/', function(req, res){
	req.logout();
	res.redirect('/');
});

module.exports= app;