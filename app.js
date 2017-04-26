/*Librerias empleadas*/

var express = require('express'),
    N = require('./nuve'),
    https = require("https"),
    licode_config = require('./../licode/licode_config'),
    http = require('http'),
    app = express();
    stylus = require('stylus');
    bodyParser = require("body-parser");
    cookieParser = require('cookie-parser');
    session = require('express-session');
    methodOverride = require('method-override');
    path = require("path");
    moment = require('moment');
    sprintf = require('sprintf-js');


/*Configuración estandar*/
app.locals.title = 'SATR';
app.locals.moment = moment;
app.locals.sprintf = sprintf.sprintf;
app.locals.email = 'diegoderus@gmail.com'; 
N.API.init=(licode_config.nuve.superserviceID, licode_config.nuve.superserviceKey, 'http://localhost::3000/');
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
app.use(methodOverride());
app.use(stylus.middleware({ src:path.join(__dirname, '/App/Public')}));
app.use(express.static(path.join(__dirname, '/App/Public')));

/*Rutas*/
require('./App/Server/Routing/Gestion_Usuarios')(app);
//require('./App/Server/')(app);

app.get('*',function(req,res)
{res.render('default')});
/*Servidor*/
var server = http.createServer(
	app).listen(app.get('port'),function(){
	console.log("EL servido esta escuchando en el puerto: " + app.get('port'));
});
