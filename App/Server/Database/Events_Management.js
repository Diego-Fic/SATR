var mongoose = require('mongoose');
var Events = mongoose.model('Events');
var conversor = require('./../../Public/js/conversor');


exports.createEvent = function(username,text,start_date,end_date,response){
	var event = new Events({
      nameUser: username,
      text: text,
      start_date: start_date,
	  end_date: end_date
    });

    event.save(function(err){
    	if (err) {
    		response(null);
    	} else {
    		response(event);
    	};

    });
};

exports.updateEvent = function(username,text,start_date,end_date,response){
	Events.update({nameUser:username},{nameUser:username,text:text,start_date:start_date,end_date:end_date},function(data){
		response(data);
	});
};

exports.removeEvent = function(username,text,start_date,end_date,response){
	Events.remove({nameUser:username,text:text,start_date:start_date,end_date:end_date},function(data){
		response(data);
	});
};

exports.removeAllEvents = function(username,response){
	Events.remove({nameUser:username},function(data){
		response(data);
	});
};

exports.findAll = function(response){
    Events.find(function(err, datos){	
      if(err) {
      	response(null);
      } else {
        for (var i = 0; i < datos.length; i++)
			datos[i].id = datos[i]._id;

      	response(datos);
      };
    });    
};


exports.findByUser = function(nameUser, response){
	Events.find({nameUser:nameUser}).lean().exec(function(err, data){

		if (data.length !=0){
			for (var i = 0; i < data.length; i++){
				
				delete data[i]._id;
				delete data[i].nameUser;
				delete data[i].__v;

				data[i].start_date = data[i].start_date.split("/").join(".");
				data[i].end_date = data[i].end_date.split("/").join(".");

				data[i].start_date = conversor.changeDateFormat(data[i].start_date);
				data[i].end_date = conversor.changeDateFormat(data[i].end_date);
			};
		}
		response(data);		
		//console.log(data);
	});		
};

exports.findbyName = function(email, response){
    Events.findOne({nameUser:email},function(err, events){
      	response(events);
    });
};