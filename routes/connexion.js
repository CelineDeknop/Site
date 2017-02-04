'use strict';

var express = require("express");
var app     = express.Router();
var sqlite3 = require("sqlite3").verbose();
var file = "DadSite.sqlite";
var db = new sqlite3.Database(file);
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');

app.get('/', function(req, res) {
    res.render('connexion', {
        titre:'connexion',
        oops:false,
        user:req.user
    });
});

app.get('/bad', function(req, res) {
    res.render('connexion', {
        titre:'connexion',
        oops:true,
        user:req.user
    });
});

app.post('/bad', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/connexion/bad'
}));

app.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/connexion/bad'
}));

module.exports= app;