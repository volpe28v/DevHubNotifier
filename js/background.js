function updateBadge(count){
  if (count == 0){
    chrome.browserAction.setBadgeBackgroundColor({color:[0, 0, 255, 100]});
    chrome.browserAction.setBadgeText({text:""});
  }else{
    chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 100]});
    chrome.browserAction.setBadgeText({text:String(count)});
  }
}

function setWebSocket(url){
  var socket = io.connect(url ,{query: 'from=chrome'});
  socket.on('message', function(data){
    messages.unshift(data);
    updateBadge(++message_count);
  });
}

// とりあえず固定で指定(オプションから出来るようにする)
var urls = ["http://dev-hub.herokuapp.com/","http://localhost:3000/"];

var message_count = 0;
var messages = [];

for (var i = 0; i < urls.length; i++){
  setWebSocket(urls[i]);
}

