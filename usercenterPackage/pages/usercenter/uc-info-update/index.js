// pages/usercenter/suggest/suggest.js
import Message from 'tdesign-miniprogram/message';
import {
  api,
  post,
  wait
} from '../../../../utils/util';

Page({
  data: {
    userInfo: {}
  },

  onLoad(options) {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    });
    this.init();
  },

  // 输入框输入时
  onInput(e) {
    const {
      value
    } = e.detail;
    const {
      name
    } = e.currentTarget.dataset;
    this.setData({
      ...this.data.userInfo,
      [name]: value,
    })
  },

  // 初始化获取用户资料
  async init() {
    const userInfo = await post(api.User.data, {
      userId: this.data.userInfo.id
    });

    if (userInfo) {
      this.setData({
        userInfo: userInfo[userInfo.length - 1]
      });
    }
  },

  async update() {
    const success = await post(api.User.updateInfo, this.data.userInfo);
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
  },
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    this.setData({
      ...this.data.userInfo,
      avatarUrl,
    })
  }
});