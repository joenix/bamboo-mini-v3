// pages/usercenter/suggest/suggest.js
import Message from 'tdesign-miniprogram/message/index';
import dayjs from 'dayjs';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    total: 0,
    listData: []
  },
  onLoad: function (options) {
    this.setData({
      score: options.score,
      total: options.score
    });
    this.getScoreData();
  },
  async getScoreData() {
    this.showLoading();
    try {
      const userInfo = wx.getStorageSync('userInfo');
      const data = await post(api.User.getScore, {
        userid: userInfo.id
      });
      this.setData({
        listData: data.map((item) => {
          return {
            ...item,
            createdAt: dayjs(item.createdAt).format('YYYY-MM-DD')
          };
        })
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
