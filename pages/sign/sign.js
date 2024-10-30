import { formatTime, day1 } from '../../utils/util';

// pages/sign/sign.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 7天签到
    days: 7,
    // 签到集合
    checks: [],
    // 连续签到
    continous: 0,
    // 上个签到日
    lastSign: '',
    // 今日是否签到
    isSign: false
  },

  // 从本地获取数据
  async init() {
    const checks = wx.getStorageSync('checks') || [];
    const continous = wx.getStorageSync('continous') || 0;
    const lastSign = wx.getStorageSync('lastSign') || '';
    const isSign = wx.getStorageSync('isSign') || false;

    // 初始化 7天 集合
    for (let i = 0; i < this.data.days; i++) {
      if (!checks[i]) {
        const last = i ? i - 1 : i;

        checks[i] = {
          checked: false,
          date: formatTime(new Date(), 'YYYY-MM-DD')
        };
      }
    }

    console.log(checks, 1);

    this.setData({ checks, continous, lastSign, isSign });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 先获取本地数据
    await this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
});
