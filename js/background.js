function updateBadge(count){
  if (count == 0){
    chrome.browserAction.setBadgeBackgroundColor({color:[0, 0, 255, 100]});
    chrome.browserAction.setBadgeText({text:""});
  }else{
    chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 100]});
    chrome.browserAction.setBadgeText({text:String(count)});
  }
}

var STORAGE_KEY = 'devhub_url';
var storage = {
  fetch: function () {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  },
  save: function (urls) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
  }
};

var devhubSocket = {
  urls: storage.fetch(),
  //urls: ["http://dev-hub.herokuapp.com","http://localhost:3000"],
  messages: [],
  message_count: 0,

  connectAll: function(){
    for (var i = 0; i < this.urls.length; i++){
      this.setSocket(this.urls[i]);
    }
  },

  reflesh: function(){
    for (var i = 0; i < this.urls.length; i++){
      if (this.urls[i].socket){
        this.urls[i].socket.disconnect();
      }
    }

    this.urls = storage.fetch();
    this.connectAll();
  },

  setSocket: function(url_obj){
    var self = this;
    var url = url_obj.url;
    // 再接続するには 'force new connection' が必要だった
    url_obj.socket = io.connect(url ,{'force new connection': true, query: 'from=chrome'});
    url_obj.socket.on('message', function(data){
      if (data.avatar && !data.avatar.match(/^http/)){
        data.avatar = url.replace(/\/$/,'') + "/" + data.avatar.replace(/^\//,'');;
      }
      self.messages.unshift(data);
      if (MAX_MESSAGE_COUNT <= self.messages.length){
        self.messages.pop();
      }
      self.message_count++;
      updateBadge(self.message_count);
    });
  }
}

var MAX_MESSAGE_COUNT = 30;

devhubSocket.connectAll();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.clear_count){
      // バッジを更新
      updateBadge(0);
      devhubSocket.message_count = 0;
      sendResponse('ok');
      return;
    }else if (request.update_option){
      devhubSocket.reflesh();
    }
  }
);
