var mongoose = require('mongoose');
var Users = mongoose.model('Users');

exports.findAllUserss = function(req, res){
       Users.find(function(err, users){
       if(err) res.send(500, err.message);
       });
};

exports.Login = function(user, passwd, response){
      Users.findOne({user:user}, function(error, result){
        console.log(result);
      });  
};
