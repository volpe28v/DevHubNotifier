var devhub_url = new Vue({
  el: '#devhub_url_app',
  data: {
    urls: storage.fetchUrls(),
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

      storage.saveUrls(this.urls);
      this.sendUpdate();
    },
    removeUrl: function (url) {
      this.urls.$remove(url.$data);
      storage.saveUrls(this.urls);
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
