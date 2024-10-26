// pages/usercenter/suggest/suggest.js
import { api, get, post, link2 } from '../../../utils/util';

Page({
  data: {
    userInfo: {}
  },

  onLoad(options) {
    // 从本地存储中获取 userInfo
    const userInfo = wx.getStorageSync('userInfo');

    this.setData({
      userInfo
    });

    this.init();
  },

  async init() {
    const userInfo = await post(api.User.data, { userId: this.data.userInfo.id });

    console.log(111, userInfo);
  },

  update() {}
});
