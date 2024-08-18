// article.js
Page({
  data: {
    url: '' // 初始化为一个空字符串
  },

  onLoad({ article }) {
    // 判断参数是否存在，并设置 URL
    if (article) {
      return this.setData({
        url: decodeURIComponent(`htps://mp.weixin.qq.com/s/${article}`)
      });
    }

    // 处理没有提供 article 参数的情况
    console.log('No article parameter provided');
  }
});
