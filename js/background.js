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
var STORAGE_NOTIFY = 'devhub_notify_enabled';
var storage = {
  fetchUrls: function () {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  },
  fetchNotify: function () {
    return JSON.parse(localStorage.getItem(STORAGE_NOTIFY) == "true");
  },
  saveNotify: function (enabled) {
    localStorage.setItem(STORAGE_NOTIFY, JSON.stringify(enabled));
  }
};

var devhubSocket = {
  urls: storage.fetchUrls(),
  messages: [],
  message_count: 0,
  notify_enabled: storage.fetchNotify(),

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
        data.avatar = url.replace(/\/$/,'') + "/" + data.avatar.replace(/^\//,'');
      }
      data.room = url_obj.title;
      data.room_url = url;
      self.messages.unshift(data);
      if (MAX_MESSAGE_COUNT <= self.messages.length){
        self.messages.pop();
      }
      self.message_count++;
      updateBadge(self.message_count);

      self.notify(data);
   });
  },
  notify: function(data){
    if (!this.notify_enabled){return}
    var opt = {
      type: 'basic',
      title: data.name + " @" + data.room,
      message: data.msg,
      iconUrl: data.avatar || "icons/icon.png"
    }
    chrome.notifications.create("", opt, function(id){ /** Do Nothing */ });
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
    }else if (request.notify_enabled != null){
      devhubSocket.notify_enabled = request.notify_enabled;
      storage.saveNotify(devhubSocket.notify_enabled);
    }
  }
);
