var mongoose = require('mongoose');
var Users = mongoose.model('Users');
var crypto = require('crypto');

exports.generateToken = function(response){
	response(crypto.randomBytes(16).toString('hex'));
};

exports.createUser = function(username,email,password,rol,response){
	var user = new Users({
      username: username,
      password: password,
      email: email,
      //token: null,
	  recoverPassword: null,
	  recoverPasswordExpires: null,
	  rol: rol
    });

    user.save(function(err){
    	if (err) {
    		response(null);
    	} else {
    		response(user);
    	};

    });
};

exports.findAllUsers = function(response){
    Users.find(function(err, users){
      if(err) {
      	response(null);
      } else {
      	response(users);
      };
    });
};


exports.Login = function(email, password, response){
      Users.findOne({email:email, password: password}, function(error, result){
         response(result);
      });       
};

exports.getUserbyEmail = function(email, response){
	Users.findOne({email:email}, function(error, result){
		response(result);
	});

}; 

exports.recoverPassword = function(recoverPassword, recoverPasswordExpires, response){
	Users.findOne({recoverPassword:recoverPassword, recoverPasswordExpires: { $gt: Date.now() } }, function(error, result){
		response(result);
	});

}; 




