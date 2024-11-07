// pages/usercenter/suggest/suggest.js
import Message from 'tdesign-miniprogram/message/index';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    total: 0,
    listData: []
  },
  onShow: function () {
    this.getScoreData();
  },
  async getScoreData() {
    this.showLoading();
    try {
      const userInfo = wx.getStorageSync('userInfo');
      const data = await post(api.User.score, {
        userId: userInfo.id
      });
      this.setData({
        score: data.score,
        total: data.total,
        listData: data.list
      });
    } catch (error) {
      console.log(error);
      this.showMessage('error', '获取数据失败');
    } finally {
      this.hideLoading();
    }
  },
  showMessage(type, content) {
    Message[type]({
      context: this,
      offset: [90, 32],
      duration: 3000,
      content
    });
  }
});
