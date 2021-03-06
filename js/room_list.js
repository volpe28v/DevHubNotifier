var room_list = new Vue({
  el: '#room_list',
  data: {
    urls: storage.fetchUrls(),
    newTitle: '',
    newUrl: '',
    edit_form: false,
    filters: {
      notify: function (url) {
        return url.notify;
      }
    }
  },

  computed: {
    enable_form: function(){
      return this.urls.length > 0 ? this.edit_form : true;
    }
  },

  ready: function () {
    this.$watch('urls', function () {
      storage.saveUrls(this.urls);
    }, true);
  },

  methods: {
    addUrl: function(){
      this.edit_form = true;
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
    },
    showRoom: function(url){
      chrome.tabs.query({url: url.url}, function(tabs){
        if (tabs.length > 0){
          chrome.tabs.update(tabs[0].id, {selected:true});
        }else{
          chrome.tabs.create({url: url.url})
        }
      });
      return false;
    },
    editForm: function(){
      this.edit_form = true;
    }
  }
});


