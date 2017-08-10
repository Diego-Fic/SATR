var mongoose = require('mongoose');
var TokenBD = mongoose.model('Tokens');
var N = require('./../../../nuve');

exports.createToken = function(email,id,response){


	N.API.createToken(id, email, 'presenter', function(token){
	console.log('token habitacion:' + token);

		var tokenbd = new TokenBD({
	      email: email,
	      token: token.toString(),
	      room: id
	    });

	    tokenbd.save(function(err){
	    	if (err) {
	    		response(null);
	    	} else {
	    		response(tokenbd);
	    	};

	    });
	});

};

exports.deleteToken = function(email,id,response){
	TokenBD.find({email:email, room: id},function(err, rooms){
      if(err) {
      	response(null);
      } else {
      	response(rooms);
      };
    });
}