'use strict';

var express = require("express");
var app     = express.Router();
var sqlite3 = require("sqlite3").verbose();
var file = "DadSite.sqlite";
var db = new sqlite3.Database(file);
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');

app.get('/', function(req, res) {
    res.render('inscription', {
        titre:'inscription',
        user:req.user,
        mailfail: false,
        already:false,
        previous: undefined
    });
});

app.post('/', function(req, res, next) {
    var nom = req.body.nom;
    var prenom =req.body.prenom;
    var mdp = hashMDP(req.body.mdp);
    var mail = req.body.mail;
    //Check if the email is valid
    var regEmail = new RegExp('^[0-9a-z._-]+@{1}[0-9a-z.-]{2,}[.]{1}[a-z]{2,5}$','i');
    if(!regEmail.test(mail)){
        res.render('inscription', {
            titre:'inscription',
            user:undefined,
            mailfail: true,
            already: false,
            previous:[nom, prenom]
        });
        return;
    }
    //Check if the mail address is already in use
    db.run("BEGIN TRANSACTION");
    var request = "SELECT * FROM USER WHERE Email = '" + mail +"'";
    var keep = true;
    db.all(request, function(err, data){
        if(data.length == 0){//Mail already in the database, incorrect
            var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
            db.run("INSERT INTO USER (Password, FirstName, LastName, Email, Lvl, Date, TemplateID) VALUES (?,?,?,?,?,?,?)",
                    [mdp, prenom, nom, mail, 0, date, null], 
            function callback(){
                db.run("END");
                next(); //Go to the nex 'app.post'
            });
        }
        else{
            res.render('inscription', {
                titre:'inscription',
                user:undefined,
                mailfail: false,
                already:true,
                previous:[nom, prenom]
            });
        }
    });
});

//Connexion after inscription
app.post('/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/connexion'
}));

//Function to hash the password
function hashMDP(mdp) {
    return bcrypt.hashSync(mdp, bcrypt.genSaltSync(8), null);
};

module.exports= app;