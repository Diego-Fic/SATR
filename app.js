/*Librerias empleadas*/

var express = require('express'),
    N = require('./nuve'),
    https = require("https"),
    config = require('./../licode/licode_config'),
    http = require('http'),
    app = express(),
    stylus = require('stylus'),
    bodyParser = require("body-parser"),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    methodOverride = require('method-override'),
    path = require("path"),
    moment = require('moment'),
    sprintf = require('sprintf-js'),
    mongoose = require('mongoose'),
    errorhandler = require('errorhandler'),
    morgan = require('morgan'),
    flash = require('express-flash');

/*Configuración estandar*/
app.locals.title = 'SATR';
app.locals.moment = moment;
app.locals.sprintf = sprintf.sprintf;
app.locals.email = 'diegoderus@gmail.com'; 
N.API.init(config.nuve.superserviceID, config.nuve.superserviceKey, 'http://localhost:3000/');
process.env.TZ= 'Europe/Madrid';
app.set('port', process.env.PROT || 8000);
app.set('views',path.join(__dirname, '/App/Server/Views'));
app.set('view engine','jade');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));
app.use(cookieParser());
app.use(session({
	resave: true, saveUninitialized: true ,secret:'secret-seed'
}));
app.use(errorhandler({
    dumpExceptions: true,
    showStack: true
}));
app.use(morgan('dev'));
app.use(flash());
app.use(methodOverride());
app.use(stylus.middleware({ src:path.join(__dirname, '/App/Public')}));
app.use(express.static(path.join(__dirname, '/App/Public')));
/*Conexión con la Base de Datos*/
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Aplicacion', function(err, res){
  if(err){
    console.log('ERROR: Conectando a la Base de Datos'+ err);
  }
});
require('./App/Server/Database/Users')(app);
require('./App/Server/Database/Rooms')(app);
require('./App/Server/Database/Events')(app);
require('./App/Server/Database/Tokens')(app);

/*Rutas*/
require('./App/Server/Routing/Gestion_Usuarios')(app);
//require('./App/Server/')(app);

//app.get('*',function(req,res){res.render('default')});


app.get('/getRooms/', function (req, res) {
    "use strict";
    N.API.getRooms(function (rooms) {
        res.send(rooms);
    //N.API.deleteRoom('598a066546026e0ca14e0988');
    });
});


/*Servidor*/
var server = http.createServer(
	app).listen(app.get('port'),function(){
	console.log("El servidor esta escuchando en el puerto: " + app.get('port'));
});
