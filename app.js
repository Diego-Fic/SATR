/*Librerias empleadas*/

var express = require('express'),
    https = require("https"),
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
    fs = require('fs');
    io = require("socket.io");
    easyrtc = require("easyrtc");

/*Configuración estandar*/
app.locals.title = 'SATR';
app.locals.moment = moment;
app.locals.sprintf = sprintf.sprintf;
app.locals.email = 'diegoderus@gmail.com'; 
process.env.TZ= 'Europe/Madrid';
app.set('port', process.env.PORT || 8000);
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

/*Añadimos las rutas*/
require('./App/Server/Database/Users')(app);
require('./App/Server/Database/Rooms')(app);
require('./App/Server/Database/Events')(app);
require('./App/Server/Database/Tokens')(app);

/*Rutas*/
require('./App/Server/Routing/Gestion_Usuarios')(app);

app.get('*',function(req,res){res.render('default')});

/*Vaciado de salas de la BD*/
var Rooms= require('./App/Server/Database/Rooms_Management');
Rooms.deleteAllRooms();
var Eventos = require('./App/Server/Database/Events_Management');
Eventos.deleteAllEvents();
var TokenBD = require('./App/Server/Database/Tokens_Management');
TokenBD.deleteAllTokens();


/*
app.get('/getRooms/', function (req, res) {
    "use strict";

    aplicacion.getRoomNames( function(err, roomNames) {
            if (err) return;
            console.log("Current Room Names: ", roomNames);
            res.send(roomNames);
        }
    );

});

app.get('/deleteRooms/', function (req, res) {
    "use strict";

    aplicacion.deleteRoom("myRoomName", function(err, roomNames) {
            if (err) return;
            console.log("Delete room ");
            res.send(roomNames);
        }
    );

});

app.get('/setRooms/', function (req, res) {
    "use strict";
    aplicacion.createRoom("myRoomName", null, function(err, roomObj) {
        if (err) throw err;
        console.log("Room " + roomObj.getRoomName() + " has been created.");
        res.send(roomObj);
    });
});
*/

/*Servidor*/

/*
var server = http.createServer(
	app).listen(app.get('port'),function(){
	console.log("El servidor esta escuchando en el puerto: " + app.get('port'));
});
*/

/*
const PORT = 8443;
    

var server = https.createServer({
    key: fs.readFileSync('Certs/localhost/micert.key'),
    cert: fs.readFileSync('Certs/localhost/cert.crt')
}, app).listen(PORT, '192.168.1.132',function(){
    console.log("El servidor esta escuchando en el puerto:" + PORT);
});
*/
  
const PORT = 8443;
    

var server = https.createServer({
    key: fs.readFileSync('Certs/localhost/micert.key'),
    cert: fs.readFileSync('Certs/localhost/cert.crt')
}, app).listen(PORT,function(){
    console.log("El servidor esta escuchando en el puerto:" + PORT);
});    

// Start Socket.io so it attaches itself to Express server
var socketServer = io.listen(server, {"log level":1});

// Start EasyRTC server
var aplicacion;


easyrtc.listen(app, socketServer,null,function(err,rtc){
    if (err) throw err;
    rtc.createApp("myApp", null, function(err, appObj){
        if (err) throw err;

        aplicacion = appObj;
        exports.aplicacion= aplicacion;
        /*
        appObj.createRoom("myRoomName", null, function(err, roomObj) {
            if (err) throw err;
            console.log("Room" + roomObj.getRoomName() + " has been created.");
        });
        appObj.getRoomNames(function(callback){
            console.log(callback;
        });
        */
    });
});



