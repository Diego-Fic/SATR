var mongoose = require('mongoose');
var TokenBD = mongoose.model('Tokens');

exports.createToken = function(email,id,response){

		var tokenbd = new TokenBD({
	      email: email,
	      room: id
	    });

	    tokenbd.save(function(err){
	    	if (err) {
	    		response(null);
	    	} else {
	    		response(tokenbd);
	    	};

	    });

};


exports.deleteAllTokens = function(){
	TokenBD.remove({}, function(err,removed){
		console.log(removed);	
	});
};

exports.findToken = function(email,id,response){
	TokenBD.findOne({email:email, room: id},function(err, rooms){
      	response(rooms);
    });
}

exports.findTokenClient = function(id,response){
	TokenBD.findOne({room:id},function(err, rooms){
      	response(rooms);
    });
}

exports.deleteToken = function(email,id,response){
	TokenBD.findOne({email:email, room: id},function(err, rooms){
      	response(rooms);
    });
}
