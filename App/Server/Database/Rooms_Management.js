var mongoose = require('mongoose');
var Rooms = mongoose.model('Rooms');
var N = require('./../../../nuve');


exports.createRooms = function(email, max, response){


	N.API.createRoom(email, function(rooms){

			console.log(rooms._id);
		/*	var room = new Rooms({
		      id: rooms._id,
		      name: email,
		      max: max
		    });
		*/
		   /* room.save(function(err){
		    	if (err) {
		    		response(null);
		    		console.log(err);
		    	} else {
		    		response(room);
		    	};		    
			});
			*/
	}, function(error){
		console.log('Error: ',error);
	});	

};

exports.createRoomToken = function(id, email, response){

	N.API.createToken(id, email, 'Admin', function(token){
		response(token);
	});
};

exports.deleteRoom = function(room, id, response){

	N.API.deleteRoom(id, function(rooms){

		room.delete();

		response(rooms);
	});

};

exports.getRoombyName = function(email, response){
	Rooms.findOne({name:email}, function(error, result){
		response(result);
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



