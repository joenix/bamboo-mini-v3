Page({
  data: {
    url: ''
  },
  onLoad: function (options) {
    if (options.url) {
      this.setData({
        url: decodeURIComponent(options.url)
      });
    }
  }
});