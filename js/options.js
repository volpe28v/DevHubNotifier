var STORAGE_KEY = 'devhub_url';

var storage = {
  fetch: function () {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  },
  save: function (urls) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
  }
};

var devhub_url = new Vue({
  el: '#devhub_url_app',
  data: {
    urls: storage.fetch(),
    newTitle: '',
    newUrl: ''
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

      storage.save(this.urls);
      this.sendUpdate();
    },
    removeUrl: function (url) {
      this.urls.$remove(url.$data);
      storage.save(this.urls);
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
