// pages/welcome/welcome.js
Page({
  data: {
    bgImage: null,
    sgImage: null,
    visible: false
  },

  switchToHome() {
    wx.switchTab({
      url: '/pages/home/home' // 跳转到首页
    });
  },

  loadImage({
    key,
    src
  }) {
    return new Promise((resolve, reject) => {
      // wx.getImageInfo({
      //   src,
      //   success: ({ path }) => resolve({ key, path }),
      //   fail: (e) => reject(e)
      // });

      resolve({
        key,
        path: src
      });
    });
  },

  preloadImage(images) {
    const promises = images.map((src) => this.loadImage(src));

    Promise.all(promises)
      .then((results) => {
        // results.forEach(({ key, path }) => this.setData({ [key]: `background-image: url(${path});` }));
        console.log(results.reduce((acc, {
          key,
          path
        }) => ({
          ...acc,
          [key]: path
        }), {}));

        this.setData({
          ...results.reduce((acc, {
            key,
            path
          }) => ({
            ...acc,
            [key]: path
          }), {}),
          visible: true
        });
      })
      .catch((e) => {
        console.error('图片加载失败：', e);
      });
  },

  onLoad() {
    this.preloadImage([{
        key: 'bgImage',
        src: 'http://oss.lhdd.club/ui/bg.jpg'
      },
      {
        key: 'sgImage',
        src: 'http://oss.vue-scaff.com/lhdd/title.png'
      }
    ]);
  },

  start() {
    wx.switchTab({
      url: '/pages/home/home' // 跳转到首页
    });
  }
});