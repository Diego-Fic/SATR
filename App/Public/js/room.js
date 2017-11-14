/*
$(document).ready(function(){
    
    var to = $('meta[name=token]').attr("content");
    var em = $('meta[name=email]').attr("content");
    var ro = $('meta[name=rol]').attr("content");

    console.log('Token:' + to);
    console.log('Email:' + em);
    console.log('Rol:' + ro);

});    
*/

var to = $('meta[name=token]').attr("content");
var em = $('meta[name=email]').attr("content");
var ro = $('meta[name=rol]').attr("content");
/*
    console.log('Token:' + to);
    console.log('Email:' + em);
    console.log('Rol:' + ro);
*/

var selfEasyrtcid = "";
var connectList = {};
var channelIsActive = {}; // tracks which channels are active

//var haveSelfVideo = false;
var otherEasyrtcid = null; 
 
function connect() {
  //easyrtc.enableDebug(false);
  easyrtc.enableDataChannels(true);
  //easyrtc.enableVideo(false);
  //easyrtc.enableAudio(false);
  //easyrtc.enableVideoReceive(false);
  //easyrtc.enableAudioReceive(false);
  easyrtc.setDataChannelOpenListener(openListener);
  easyrtc.setDataChannelCloseListener(closeListener);
  easyrtc.setPeerListener(addToConversation);
  easyrtc.setRoomOccupantListener(convertListToButtons);
  easyrtc.joinRoom(to,null,null,null);
  easyrtc.connect("easyrtc.dataMessaging", loginSuccess, loginFailure);
  //easyrtc.setAutoInitUserMedia(false);
  


      easyrtc.getVideoSourceList(function(videoSrcList) {
            for (var i = 0; i < videoSrcList.length; i++) {
                var videoEle = videoSrcList[i];
                var videoLabel = (videoSrcList[i].label && videoSrcList[i].label.length > 0) ?
                        (videoSrcList[i].label) : ("src_" + i);
                easyrtc.setVideoSource(videoSrcList[i].deviceId);
                easyrtc.initMediaSource(
                    function(stream) {
                        var labelBlock = addMediaStreamToDiv("video-teacher2", stream, videoLabel, true);
                        if (otherEasyrtcid) {
                            easyrtc.addStreamToCall(otherEasyrtcid, videoLabel);
                        }
                    },
                    function(errCode, errText) {
                        easyrtc.showError(errCode, errText);
                    }, videoLabel);
            }
      });

    if (ro=="Client") {
        var streamName = "screen";
        easyrtc.initDesktopStream(
                function(stream) {
                    var labelBlock = addMediaStreamToScreen("screen-teacher", stream, streamName, true);
                    if (otherEasyrtcid) {
                        easyrtc.addStreamToCall(otherEasyrtcid, streamName);
                    }
                },
                function(errCode, errText) {
                    easyrtc.showError(errCode, errText);
                },
                streamName);
    }
}
 
 
//SCREEN
function createLabelledButton(buttonLabel) {
    var button = document.createElement("button");
    button.appendChild(document.createTextNode(buttonLabel));
    document.getElementById("screen-teacher").appendChild(button);
    return button;
}

function addMediaStreamToScreen(divId, stream, streamName, isLocal)
{
    var video = document.createElement("video");
    video.width = 1158;
    video.height = 820;
    //video.muted = isLocal; //muterar audio
    video.style.verticalAlign = "middle";
    document.getElementById(divId).appendChild(video);
    video.autoplay = true;
    easyrtc.setVideoObjectSrc(video, stream);
}

function addMediaStreamToDiv(divId, stream, streamName, isLocal)
{
    var video = document.createElement("video");
    video.width = 335;
    video.height = 180;
    video.muted = isLocal; //muterar audio
    //video.style.verticalAlign = "middle";
    document.getElementById(divId).appendChild(video);
    video.autoplay = true;
    easyrtc.setVideoObjectSrc(video, stream);
}

//CHAT
function addToConversation(who, msgType, content) {
  // Escape html special characters, then add linefeeds.
  content = content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  content = content.replace(/\n/g, "<br />");
  if (who=="Me"){
    document.getElementById("conversation").innerHTML +=
      "<b>" + who + ":</b>&nbsp;" + content + "<br />";
  } else {
    document.getElementById("conversation").innerHTML +=
      "<b>" + "Other" + ":</b>&nbsp;" + content + "<br />";
  }    
}
 
 
function openListener(otherParty) {
  channelIsActive[otherParty] = true;
  updateButtonState(otherParty);
}
 
 
function closeListener(otherParty) {
  channelIsActive[otherParty] = false;
  updateButtonState(otherParty);
}
 
function convertListToButtons(roomName, occupantList, isPrimary) {
  connectList = occupantList;
 
  var otherClientDiv = document.getElementById("otherClients");
  while (otherClientDiv.hasChildNodes()) {
    otherClientDiv.removeChild(otherClientDiv.lastChild);
  }
 
  var label, button;


  for (var easyrtcid in connectList) {
  
        var rowGroup = document.createElement("span");
        //var rowLabel = document.createTextNode(easyrtc.idToName(easyrtcid));
        var rowLabel = document.createTextNode("All Ready ");
        
        rowGroup.appendChild(rowLabel);
     
        button = document.createElement("button");
        button.id = "connect_" + easyrtcid;
        button.onclick = function(easyrtcid) {
          return function() {
            startCall(easyrtcid);
          };
        }(easyrtcid);
        label = document.createTextNode("Connect");
        button.appendChild(label);
        rowGroup.appendChild(button);
     
        button = document.createElement("button");
        button.id = "send_" + easyrtcid;
        button.onclick = function(easyrtcid) {
          return function() {
            sendStuffP2P(easyrtcid);
          };
        }(easyrtcid);
        label = document.createTextNode("Send Message");
        button.appendChild(label);
        rowGroup.appendChild(button);
        otherClientDiv.appendChild(rowGroup);
        updateButtonState(easyrtcid);
    }
   
  if (ro = 'Client'){
    document.getElementById("connect_" + easyrtcid).disabled = true;
  }

  if (!otherClientDiv.hasChildNodes()) {
    otherClientDiv.innerHTML = "<em>Nobody else logged in to talk to...</em>";
  }
}
 
function updateButtonState(otherEasyrtcid) {
  var isConnected = channelIsActive[otherEasyrtcid];
  if(document.getElementById("connect_" + otherEasyrtcid)) {
    document.getElementById("connect_" + otherEasyrtcid).disabled = isConnected;
  }
  if( document.getElementById("send_" + otherEasyrtcid)) {
    document.getElementById("send_" + otherEasyrtcid).disabled = !isConnected;
  }
}
 
 
function startCall(otherEasyrtcid) {
  if (easyrtc.getConnectStatus(otherEasyrtcid) === easyrtc.NOT_CONNECTED) {
    try {
    easyrtc.call(otherEasyrtcid,
        function(caller, media) { // success callback
          if (media === "datachannel") {
            // console.log("made call succesfully");
            connectList[otherEasyrtcid] = true;
          }
        },
        function(errorCode, errorText) {
          connectList[otherEasyrtcid] = false;
          easyrtc.showError(errorCode, errorText);
        },
        function(wasAccepted) {
          // console.log("was accepted=" + wasAccepted);
        }
    );
    }catch( callerror) {
      console.log("saw call error ", callerror);
    }
  }
  else {
    easyrtc.showError("ALREADY-CONNECTED", "already connected to " + easyrtc.idToName(otherEasyrtcid));
  }
}
 
function sendStuffP2P(otherEasyrtcid) {
  var text = document.getElementById("sendMessageText").value;
  if (text.replace(/\s/g, "").length === 0) { // Don"t send just whitespace
    return;
  }
  if (easyrtc.getConnectStatus(otherEasyrtcid) === easyrtc.IS_CONNECTED) {
    easyrtc.sendDataP2P(otherEasyrtcid, "msg", text);
  }
  else {
    easyrtc.showError("NOT-CONNECTED", "not connected to " + easyrtc.idToName(otherEasyrtcid) + " yet.");
  }
 
  addToConversation("Me", "msgtype", text);
  document.getElementById("sendMessageText").value = "";
}
 
 
function loginSuccess(easyrtcid) {
  selfEasyrtcid = easyrtcid;
  document.getElementById("iam").innerHTML = "I am " + ro;
}
  
function loginFailure(errorCode, message) {
  easyrtc.showError(errorCode, "failure to login");
}

easyrtc.setStreamAcceptor(function(easyrtcid, stream, streamName) {
    if (streamName=="screen"){
        var labelBlock = addMediaStreamToScreen("screen-teacher", stream, streamName, false);
    } else {
        var labelBlock = addMediaStreamToDiv("video-teacher", stream, streamName, false);
    }
/*
    console.log("ID: " + easyrtcid);
    console.log("Stream: " + stream);
    console.log("Stream: " + streamName);
*/
});

easyrtc.setAcceptChecker(function(easyrtcid, callback) {
    otherEasyrtcid = easyrtcid;
    if (easyrtc.getConnectionCount() > 0) {
        easyrtc.hangupAll();
    }
    callback(true, easyrtc.getLocalMediaIds());
});