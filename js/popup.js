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
      this.messages = chrome.extension.getBackgroundPage().messages;
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
