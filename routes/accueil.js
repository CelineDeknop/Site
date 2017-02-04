'use strict';

var express = require("express");
var app     = express.Router();
var sqlite3 = require("sqlite3").verbose();
var file = "DadSite.sqlite";
var db = new sqlite3.Database(file);

app.get('/', function(req, res) {
	res.render('accueil', {
		titre:'accueil',
		user:req.user
	});
});

module.exports = app;