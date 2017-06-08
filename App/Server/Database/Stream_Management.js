var Erizo = require('./../../../nuve').Erizo;

var streamSupport = Erizo.Stream({audio:true, video:true, data:true, videoSize:[320, 240, 640, 480]});
var streamClient = Erizo.Stream({audio:true, screen:true, data:true});


//streamSupport.init();
//streamClient.init();

exports.conectRoom = function(id, response){

	var room = Erizo.Room({token:id});


};