var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/Aplication', function(err, res){
  if(err){
    console.log('ERROR: Conectando a la Base de Datos'+ err);
  }
});

module.exports = db;
