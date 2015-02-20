var room_list = new Vue({
  el: '#room_list',
  data: {
    urls: storage.fetchUrls(),
    newTitle: '',
    newUrl: '',
    filters: {
      notify: function (url) {
        return url.notify;
      }
    }
  },

  ready: function () {
    this.$watch('urls', function () {
      storage.saveUrls(this.urls);
    }, true);
  },

  methods: {
    addUrl: function(){
      if (this.newTitle == '' || this.newUrl == ''){
        return;
      }

      this.urls.unshift({
        title: this.newTitle,
        url: this.newUrl
      });
      this.newTitle = '';
      this.newUrl = '';

      this.sendUpdate();
    },
    removeUrl: function (url) {
      this.urls.$remove(url.$data);
      this.sendUpdate();
    },
    sendUpdate: function(){
      // background.js へ更新通知
      chrome.runtime.sendMessage({"update_option": true},function(response) {
        console.log(response);
      });
    }
  }
});

var message_list = new Vue({
  el: '#message_list',
  data: {
    messages: []
  },

  created: function () {
    this.loadMessages();
  },

  filters: {
    formatDate: function (d) {
      return moment(d).format('YYYY-MM-DD');
    },
    fromNow: function (d) {
      return moment(d).fromNow();
    }
  },

  methods: {
    loadMessages: function(){
      this.messages = chrome.extension.getBackgroundPage().devhubSocket.messages;
    }
  }
});

function clearCount(){
  chrome.runtime.sendMessage({"clear_count": true,},function(response) {
  });
}

$(document).ready(function() {
  clearCount();
});
