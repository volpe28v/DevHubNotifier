var message_list = new Vue({
  el: '#message_list',
  data: {
    messages: []
  },

  computed: {
    exist_messages: function(){
      return this.messages.length > 0;
    }
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
    },
    showRoom: function(message){
      chrome.tabs.query({url: message.room_url}, function(tabs){
        if (tabs.length > 0){
          chrome.tabs.update(tabs[0].id, {selected:true});
        }else{
          chrome.tabs.create({url: message.room_url})
        }
      });
      return false;
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
