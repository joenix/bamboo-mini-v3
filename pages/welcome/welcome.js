import { checkToken, api, get, post, link2 } from '../../utils/util';

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

  loadImage({ key, src }) {
    return new Promise((resolve, reject) => {
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
        console.log(
          results.reduce(
            (acc, { key, path }) => ({
              ...acc,
              [key]: path
            }),
            {}
          )
        );

        this.setData({
          ...results.reduce(
            (acc, { key, path }) => ({
              ...acc,
              [key]: path
            }),
            {}
          ),
          visible: true
        });
      })
      .catch((e) => {
        console.error('图片加载失败：', e);
      });
  },

  async onLoad() {
    this.preloadImage([
      {
        key: 'bgImage',
        src: 'https://oss.lhdd.club/ui/bg.jpg'
      },
      {
        key: 'sgImage',
        src: 'http://oss.vue-scaff.com/lhdd/title.png'
      }
    ]);

    try {
      // 1. Login for Get Code
      const { code } = await new Promise((resolve, reject) => wx.login({ success: resolve, fail: reject }));

      // 2. Code To Session
      const { session_key, openid } = await post('/wx/login', { code });

      // 3. Cache into Storage
      wx.setStorageSync('session_key', session_key);
      wx.setStorageSync('openid', openid);
    } catch (e) {
      console.log('Login Error:', e);
    }
  },

  async onGetPhoneNumber(e) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      const session_key = wx.getStorageSync('session_key');
      const openid = wx.getStorageSync('openid');

      const { purePhoneNumber: mobile } = await post('/wx/phone', {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        session_key
      });

      const token = await post('/wx/mnp_login', { mobile, openid });
      wx.setStorageSync('token', token);

      wx.switchTab({
        url: '/pages/home/home' // 跳转到首页
      });

      return;
    }

    wx.showToast({
      title: '登录失败',
      icon: 'none',
      duration: 3000
    });
  }
});
