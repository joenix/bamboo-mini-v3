// pages/usercenter/suggest/suggest.js
import Message from 'tdesign-miniprogram/message/index';
import { api, get, post, link2, wait } from '../../../utils/util';

Page({
  data: {
    userInfo: {}
  },

  onLoad(options) {
    // 从本地存储中获取 userInfo，来自前一个页面
    const userInfo = wx.getStorageSync('userInfo');

    this.setData({
      userInfo
    });

    this.init();
  },

  // 输入框输入时
  onInput(e) {
    const { value } = e.detail;
    const { name } = e.currentTarget.dataset;

    this.data.userInfo[name] = value;

    wx.setStorageSync('userInfo', this.data.userInfo);

    // this.setData({
    //   userInfo: {
    //     [name]: value
    //   }
    // });
  },

  // 初始化获取用户资料
  async init() {
    const userInfo = await post(api.User.data, { userId: this.data.userInfo.id });

    if (userInfo) {
      this.setData({
        userInfo: userInfo[userInfo.length - 1]
      });
    }
  },

  async update() {
    const { id, leftEyes, rightEyes, height, weight } = wx.getStorageSync('userInfo'); // this.data.userInfo;
    const success = await post(api.User.updateInfo, { id, leftEyes, rightEyes, height, weight });

    if (success) {
      Message.success({
        context: this,
        offset: [90, 32],
        duration: 3000,
        content: '更新成功'
      });

      await wait(2000);

      wx.navigateBack({
        delta: 1
      });
    }
  }
});
