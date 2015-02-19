var message_list = new Vue({
  el: '#message_list',
  data: {
    messages: [],
    notify_enabled: chrome.extension.getBackgroundPage().devhubSocket.notify_enabled
  },

  ready: function () {
    this.$watch('notify_enabled', function () {
      chrome.runtime.sendMessage({"notify_enabled": this.notify_enabled},function(response) {
      });
    }, true);
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
