var mongoose = require('mongoose');
var Rooms = mongoose.model('Rooms');
var easyrtc = require('./../../../app');
var crypto = require('crypto');

exports.createRooms = function(email,destination, response){

var clave = crypto.randomBytes(8).toString('hex');

	easyrtc.aplicacion.createRoom(clave, null, function(err, roomObj) {
        if (err) throw err;
        console.log("Room " + roomObj.getRoomName() + " has been created.");

			var room = new Rooms({
				      id: clave,
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

exports.deleteAllRooms = function(){

	Rooms.remove({}, function(err,removed){
		console.log(removed);	
	});
};

exports.deleteRoom = function(id){

	easyrtc.aplicacion.deleteRoom(id, function(err, roomNames) {
		 if (err) return;
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

exports.findAllRooms = function(response){
    Rooms.find(function(err, rooms){
      if(err) {
      	response(null);
      } else {
      	response(rooms);
      };
    });
};



