var mongoose = require('mongoose');
var Rooms = mongoose.model('Rooms');
var N = require('./../../../nuve');

exports.createRooms = function(email,destination, response){

	N.API.createRoom(email, function(rooms){
/*		
		N.API.createToken(rooms._id, email, 'presenter', function(token){
			console.log('token habitacion:' + token);
		});
		N.API.createToken(rooms._id, destination, 'presenter', function(token){
			console.log('token habitacion:' + token);
*/
			var room = new Rooms({
				      id: rooms._id.toString(),
				      name: email,
				      destination: destination
				    });	

		   	room.save(function(err){
		    	if (err) {
		    		response(null);
		    		console.log(err);
		    	} else {
		    		response(room);
		    	};		    
			});
	    });
//	});	
};

exports.deleteRoom = function(id){

	N.API.deleteRoom(id, function(rooms){

	});
};

exports.findAllbyName = function(email, response){
    Rooms.find({name:email},function(err, rooms){
      if(err) {
      	response(null);
      } else {
      	response(rooms);
      };
    });
};

exports.getRoombyName = function(email, response){
	Rooms.findOne({name:email}, function(error, result){
		response(result);
	});
}; 

exports.getRoombyId = function(id, response){
	Rooms.findOne({id:id}, function(error, result){
		response(result);
	});
};

exports.findRoombyId = function(roomId, response){
	N.API.getRoom(roomId, function(resp) {
	  var room= JSON.parse(resp);
	  response(room);
	});
};

exports.findAllRooms = function(response){
    Rooms.find(function(err, rooms){
      if(err) {
      	response(null);
      } else {
      	response(rooms);
      };
    });
};



