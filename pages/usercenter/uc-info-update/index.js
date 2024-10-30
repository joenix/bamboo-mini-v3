// pages/usercenter/suggest/suggest.js
import Message from 'tdesign-miniprogram/message/index';
import { api, get, post, link2, wait } from '../../../utils/util';

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

    if (userInfo) {
      this.setData({
        userInfo: userInfo[userInfo.length - 1]
      });
    }
  },

  async update() {
    const { id, leftEyes, rightEyes, height, weight } = this.data.userInfo;
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
