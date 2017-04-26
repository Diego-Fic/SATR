var mongoose = require('mongoose');
var Clients = mongoose.model('Clients');

exportsfindAllCLients = function(req, res){
    Clients.find(function(err, clients){
    
    if(err) 
       res.send(500, err.message);

    console.log('GET /Clients')
       res.status(200).jsonp(clients);
  }); 
};
