'use strict';

var express = require("express");
var app     = express.Router();
var sqlite3 = require("sqlite3").verbose();
var file = "DadSite.sqlite";
var db = new sqlite3.Database(file);
var mom = require("momentjs");

app.get('/', function(req, res) {
    if(!req.user){//If the user is not connected, he souldn't be here
        res.redirect("/connexion");
        return;
    }
    var request1 = "SELECT * FROM CV WHERE UserID = " + req.user[0].User_ID +" ;";
    db.all(request1, function(err, CVdata){//Get the CV
        if(CVdata[0]){//If we got a CV, fetch the formations & experiences
            var request2 = "SELECT * FROM FORMATION WHERE CVID = "+CVdata[0].CV_ID;
            db.all(request2, function(err2, formData){//Get the formations
                var request3 = "SELECT * FROM EXPERIENCE WHERE CVID = " +CVdata[0].CV_ID;
                db.all(request3, function(err3, expData){//Get the experiences
                    console.log(formData);
                    res.render('modifCV', {
                        titre:'CV',
                        user:req.user,
                        CV:CVdata,
                        form:formData,
                        exp:expData,
                        moment:mom,
                        badbirth:false,
                        previous:undefined
                    });
                });
            });
        }
        else{
            res.render('modifCV', {
                titre:'CV',
                user:req.user,
                CV:undefined,
                form:undefined,
                exp:undefined,
                badbirth:false,
                previous:undefined
            });
        }
    });
});

app.post('/', function(req, res, next) {
	//Get all the variables
	var phone = req.body.phone;
	var address = req.body.address;
	var birthRaw = req.body.birth;
	var regEx = /[-\.\/]/;
	var values = birthRaw.split(regEx);
	var birth;
	if(values.length == 3){
		birth = new Date(values[2]+'-'+ values[1] + '-' + values[0]).toISOString().slice(0, 19).replace('T', ' ');
	}
	else{
		//Birthdate invalid
		res.render('modifCV', {
			titre:'CV',
			user:req.user,
			badbirth:true,
			previous:[phone, address]
		});
		return;
	}
	var allFormsDesc = req.body.form;
	var allFormDate = req.body.ftime;
	var allExpDesc = req.body.exp;
	var allExpDate = req.body.etime;
	var allExpRem = req.body.erem;

	//Do db inserts
	db.run("BEGIN TRANSACTION");
	db.run("UPDATE CV SET Phone='"+phone+"', Address='"+address+"', Birth ='"+birth+"' WHERE UserID = "+req.user[0].User_ID , 
    function callback(){
    	db.run("END"); //Assured the CV is inserted
    	var request = "SELECT CV_ID FROM CV WHERE UserID = " + req.user[0].User_ID+" ;";
    	db.all(request, function(err, data){
    		db.run("BEGIN TRANSACTION");
    		var regEx = /[-\.\/]/;
    		var dateSplit;
    		var stop;
    		var desc;
    		if(!Array.isArray(allFormsDesc)){ //If it isn't an array, there is just one form
    			stop = 1;
    			desc = allFormsDesc;
    		}
    		else
    			stop = allFormsDesc.length;
    		for(var i = 0; i < stop; i++){
    			if(Array.isArray(allFormDate)){//Get all the variables
    				desc = allFormsDesc[i];
    				dateSplit = allFormDate[i].split(regEx);
    			}
    			else
    				dateSplit = allFormDate.split(regEx);
    			if(dateSplit.length == 6){//If we have 6 values then dates may be correct
    				try{//Try to make the date and insert
    					var dateStart = new  Date(dateSplit[2].trim()+'-'+ dateSplit[1].trim() + '-' + dateSplit[0].trim()).toISOString().slice(0, 19).replace('T', ' ');
    					var dateEnd = new  Date(dateSplit[5].trim()+'-'+ dateSplit[4].trim() + '-' + dateSplit[3].trim()).toISOString().slice(0, 19).replace('T', ' ');
    					db.run("INSERT OR REPLACE INTO FORMATION (CVID, DateStart, DateEnd, Description) VALUES (?,?,?,?)",
                   			[data[0].CV_ID, dateStart, dateEnd, desc]);//Encoded formation
    				}
    				catch(err){
    					//Date went wrong, just ignore it
    				}
                }
            }
            var rem;
            if(!Array.isArray(allExpDesc)){
    			stop = 1;
    			desc = allExpDesc;
    			if(allExpRem == "")
    				rem = null;
    			else
    				rem = allExpRem;
            }
    		else
    			stop = allExpDesc.length;
    		for(var i = 0; i < stop; i++){			
    			if(Array.isArray(allExpDate)){
    				if(allExpRem[i] == "")
    					rem = null;
    				else
    					rem = allExpRem[i];

    				desc = allExpDesc[i];
    				dateSplit = allExpDate[i].split(regEx);
    			}
    			else
    				dateSplit = allExpDate.split(regEx);
    			if(dateSplit.length == 6){//If we have 6 values then dates are correct
    				try{//Try to make the dates and insert
    					var dateStart = new  Date(dateSplit[2].trim()+'-'+ dateSplit[1].trim() + '-' + dateSplit[0].trim()).toISOString().slice(0, 19).replace('T', ' ');
    					var dateEnd = new  Date(dateSplit[5].trim()+'-'+ dateSplit[4].trim() + '-' + dateSplit[3].trim()).toISOString().slice(0, 19).replace('T', ' ');
    					db.run("INSERT OR REPLACE INTO EXPERIENCE (CVID, DateStart, DateEnd, Description, Remarque) VALUES (?,?,?,?,?)",
                   			[data[0].CV_ID, dateStart, dateEnd, desc, rem]);//Encoded experience
    				}
    				catch(err){
    					//Just ignore that one
    				}
                }
    		}
    		db.run("END", function callback(){ //We have finished with the database
                res.redirect('/CV');//Redirect to CV page
            });
    	});
	});
	
});

module.exports = app;