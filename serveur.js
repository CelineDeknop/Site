'use strict';

/* __________________________________________
              Dependencies
_____________________________________________*/
var express       = require("express");
var app           = express();
var path          = require("path");
var bodyParser    = require('body-parser');       //Get form input
var engines       = require('consolidate');       //Use ejs
var cookieParser  = require('cookie-parser');     //Cookies
var session       = require('express-session');   //Sessions
var passport      = require('passport');          //Connexion
var LocalStrategy = require('passport-local').Strategy; 
var sqlite3       = require("sqlite3").verbose(); //Database module
var bcrypt        = require('bcrypt-nodejs');     //Encryption
var moment        = require('momentjs');          //Date parsing

//Opening database
var file = "DadSite.sqlite";
var db = new sqlite3.Database(file);


//Handle Sessions (MUST be BEFORE passport.initialize)
app.use(cookieParser());
app.use(session({
  secret: 'OIKUTDFcvfspvlhkcgdbnqpàç!è§zte',
  resave: true,
  saveUninitialized: false
}));

//Handle POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Initialization passport.js
app.use(passport.initialize());
app.use(passport.session());


/* __________________________________________
              Heroku part
_____________________________________________*/
var debug = require('debug')('test:server');
var http = require('http');

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

var port = normalizePort(process.env.PORT || '8080');
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/* __________________________________________
            End Heroku part
_____________________________________________*/

/* __________________________________________
            Passport.js part
_____________________________________________*/
function validerMDP(mdp, user) { //Match hashed passwords
    return bcrypt.compareSync(mdp, user[0].Password);
};

passport.serializeUser(function(user, done) { //Save user for session
  done(null, user.Email);
});

passport.deserializeUser(function(id, done) {
  var request = "SELECT * FROM USER WHERE Email = '" + id +"'";
  db.all(request, function(err, data){
    done(err, data);
  });
});

//Handle connexion
passport.use(new LocalStrategy({
  usernameField: 'mail',
  passwordField: 'mdp'
},
function(mail, mdp, done) {
  var request = "SELECT * FROM USER WHERE Email = '" + mail + "';";
    db.all(request, function(err, user){
      //console.log(user);
      if (err) {
        console.log(err)
        return done(err); 
      }
      if (user.length < 1) {
        console.log("user not found")
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!validerMDP(mdp, user)){
        console.log("invalid password")
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user[0]);
    });
}));

/* __________________________________________
            End Passport.js
_____________________________________________*/

//Where to find static files
app.use(express.static(path.join(__dirname, '/public')));
app.use('public/images', express.static(path.join(__dirname, 'public/images')));


//Routes
var accueil = require('./routes/accueil.js');
var inscr = require('./routes/inscription.js');
var connexion = require('./routes/connexion.js');
var logout = require('./routes/logout.js');
var cv = require('./routes/CV.js');
var creerCv = require('./routes/creerCV.js');
var modifCv = require('./routes/modifCV.js');

//Set page engine to ejs
app.set('view engine', 'ejs');

//Set routes
app.use('/', accueil);
app.use('/inscription', inscr);
app.use('/connexion', connexion);
app.use('/logout', logout);
app.use('/CV', cv);
app.use('/creerCV', creerCv);
app.use('/modifCV', modifCv);

//If we got here, it is a 404
app.use(function(req, res, next){
  //res.render('404', {});
  //console.log("404");

});

//Log to see when the server is up
console.log("Running at Port 8080");