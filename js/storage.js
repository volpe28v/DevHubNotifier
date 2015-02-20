var STORAGE_KEY = 'devhub_url';

var storage = {
  fetchUrls: function () {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  },
  saveUrls: function (urls) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
  }
};


