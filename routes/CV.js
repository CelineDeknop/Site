'use strict';

var express = require("express");
var app     = express.Router();
var sqlite3 = require("sqlite3").verbose();
var file = "DadSite.sqlite";
var db = new sqlite3.Database(file);
var mom = require("momentjs");//Date parser

app.get('/', function(req, res) {
	if(!req.user){//If the user is not connected, he souldn't be here
		res.redirect("/connexion");
		return;
	}
	//var data;
	var request1 = "SELECT * FROM CV WHERE UserID = " + req.user[0].User_ID +" ;";
  	db.all(request1, function(err, CVdata){//Get the CV
  		if(CVdata[0]){//If we got a CV, fetch the formations & experiences
  			var request2 = "SELECT * FROM FORMATION WHERE CVID = "+CVdata[0].CV_ID;
  			db.all(request2, function(err2, formData){//Get the formations
  				var request3 = "SELECT * FROM EXPERIENCE WHERE CVID = " +CVdata[0].CV_ID;
  				db.all(request3, function(err3, expData){//Get the experiences
  					console.log(CVdata);
  					console.log(formData);
  					console.log(expData);
  					res.render('CV', {
						titre:'CV',
						user:req.user,
						CV:CVdata,
						form:formData,
						exp:expData,
						moment:mom
					});
  				});
  			});
  		}
  		else{
  			res.render('CV', {
				titre:'CV',
				user:req.user,
				CV:undefined,
				form:undefined,
				exp:undefined
			});
  		}
  	});
});

module.exports = app;