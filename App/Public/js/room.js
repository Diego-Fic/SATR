$(document).ready(function(){
    
    var tokenJ = $('meta[name=token]').attr("content");
    var client = $('meta[name=client]').attr("content");
    var support = $('meta[name=support]').attr("content");
    var rol = $('meta[name=rol]').attr("content");

    //console.log('CLIENT: ' + client);
    //console.log('Client2: ' + client2);
    var mute = true;
    var conn = 0;
    var room = Erizo.Room({token: 'eyJ0b2tlbklkIjoiNTk3OGU0MDk0OTY2M2QzMmEwYThiMmFhIiwiaG9zdCI6IjEwLjAuMi4xNTo4MDgwIiwic2VjdXJlIjpmYWxzZSwic2lnbmF0dXJlIjoiTkdRME1XSmtZelUzWlRZME4yRTVNVEUxWmpjNFpqSXhNVGhpTnpJNE1XRmlaakZrWlRoak53PT0ifQ=='});
    
    var localStream = Erizo.Stream({video:true, audio: true, data:true, videoSize:[240, 180, 240, 180],
attributes:{client:client, support:support, rol:rol}});

    localStream.init();

    localStream.addEventListener('access-accepted', function() {
        console.log("Access to webcam and/or microphone granted");
        localStream.stream.getAudioTracks()[0].enabled = !mute;
        if(conn) room.publish(localStream, {maxVideoBW: 100});
    });

    localStream.addEventListener('access-denied', function(event) {
      console.log("Access to webcam and/or microphone rejected");
    });

    $('body > button').click(function(){
        window.location='/';
    });


    $('#message').submit(function(e){
        if(localStream){
            if(rol == undefined){
                e.preventDefault();
                var $c = $('#usermsg');
                var m = $c.val();
                $c.val('');
                $c.focus();
                $c = $('#chatbox');
                $c.append($('<div>'));
                $c.find('div').last().html('<p class="'+ destination +'"><b>' + destination + ': </b>' + m + '</p>');
                $c.animate({scrollTop: 0xfffffff});
                localStream.sendData({text: m, destination: destination, type:'message'});
            }else {
                e.preventDefault();
                var $c = $('#usermsg');
                var m = $c.val();
                $c.val('');
                $c.focus();
                $c = $('#chatbox');
                $c.append($('<div>'));
                $c.find('div').last().html('<p class="'+ destination +'"><b>' + destination + ': </b>' + m + '</p>');
                $c.animate({scrollTop: 0xfffffff});
                localStream.sendData({text: m, destination: destination, type:'message'});
            }
        }    
    });

    var subscribeToStreams = function (streams) {
        for (var i = 0; i < streams.length; i++) {
            var stream = streams[i];
            if (localStream.getID() !== stream.getID()) {
                room.subscribe(stream);
            }
        }
    };

    room.addEventListener("room-connected", function (roomEvent) {
        conn=1;
        console.log('in the room');
        console.log(localStream.hasData());
        subscribeToStreams(roomEvent.streams);
    });

     room.addEventListener("stream-subscribed", function(streamEvent) {
        console.log('stream subscribed');
        var stream = streamEvent.stream;
        var attributes = stream.getAttributes();
        console.log(attributes);
        stream.addEventListener("stream-data", function(evt){
            if(evt.msg.type == 'COMM'){
                console.log('toggledddd');
                if(evt.msg.nick == nick){
                    console.log('sound toggled', mute);
                    mute = !mute;
                    localStream.stream.getAudioTracks()[0].enabled = !mute;
                }
            }else{
                var $c = $('#chatbox').append($('<div>'));
                $c.find('div').last().html('<p><b>' + evt.msg.nick + ': </b>' + evt.msg.text + '</p>');
            }
        });
        if(attributes.role == undefined){
            if(attributes.media == 'screen'){
                stream.show('screen-teacher')
            }
            else{
                stream.show('video-teacher');
            }
        }else {
            $('#video-student').append($('<div>'));
            $('#video-student > div').last().append($('<div>').attr({'id': stream.getID().toString(), 'class': "sframe"}));
            $('#video-student > div').last().append($('<p>').attr('class', "sname").html(attributes.nick));
            stream.show(stream.getID().toString());
        }
    });

    room.addEventListener("stream-added", function (streamEvent) {
        console.log('added stream');
        var streams = [];
        streams.push(streamEvent.stream);
        subscribeToStreams(streams);
    });



    room.addEventListener("stream-removed", function (streamEvent) {
        // Remove stream from DOM
        var stream = streamEvent.stream;
        var attributes = stream.getAttributes();
        console.log(attributes);
        if (attributes.role == 'teacher'){
            if((attributes.media == 'screen')){
                $('#screen-teacher').empty();
            }else{
                $('#main').empty();
                $('body > button').show();
            }
        }else if (stream.elementID !== undefined) {
            $('#' + stream.elementID.toString()).parent().remove();
        }
    });

    room.addEventListener("stream-failed", function (){
    console.log("STREAM FAILED, DISCONNECTION");
    room.disconnect();

    });

    room.connect();
});    
