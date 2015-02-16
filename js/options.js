var STORAGE_KEY = 'devhub_url';

var storage = {
  fetch: function () {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  },
  save: function (todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
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
    }
  }
});
