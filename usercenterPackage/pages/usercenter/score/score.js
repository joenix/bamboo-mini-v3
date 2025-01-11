// pages/usercenter/suggest/suggest.js
import Message from 'tdesign-miniprogram/message/index';
import dayjs from 'dayjs';
import { api, post } from '../../../../utils/util';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    total: 0,
    listData: [],
    methodPopup: false
  },
  onLoad: function (options) {
    this.setData({
      score: options.score
    });
    this.getScoreData();
  },
  async getScoreData() {
    wx.showLoading({
      title: '加载中'
    });
    try {
      const userInfo = wx.getStorageSync('userInfo');
      const data = await post(api.User.getScore, {
        userid: userInfo.id
      });
      let total = 0;
      const listData = data.map((item) => {
        if (item.credit > 0) {
          total += item.credit;
        }
        return {
          ...item,
          createdAt: dayjs(item.createdAt).format('YYYY-MM-DD')
        };
      });

      this.setData({
        listData,
        total
      });
    } catch (error) {
      console.log(error);
      this.showMessage('error', '获取数据失败');
    } finally {
      wx.hideLoading();
    }
  },
  showMessage(type, content) {
    Message[type]({
      context: this,
      offset: [90, 32],
      duration: 3000,
      content
    });
  },
  openGetMethodPopup() {
    this.setData({
      methodPopup: true
    });
  },
  onMethodPopupOpen(e) {
    this.setData({
      methodPopup: e.detail.visible
    });
  }
});
