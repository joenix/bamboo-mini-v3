import { lunar, api, post, link2 } from '../../utils/util';

// pages/book/book.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    format(current) {
      const { date } = current;

      // 年
      const year = date.getFullYear();
      // 月
      const month = date.getMonth() + 1;
      // 日
      const today = date.getDate();

      // 农历
      const { dayStr, day, monthStr } = lunar.solarToLunar(year, month, today);

      // 月份
      if (day === 1) {
        current.prefix = monthStr;
        current.className = 'is-holiday';
      }

      if ([21, 22, 27, 30].includes(day)) {
        current.className = 'is-readed';
      }

      // 日期
      current.suffix = dayStr;

      // Update
      return current;
    }
  },

  link_ranking() {
    link2('book/ranking/ranking');
  },

  link_read() {
    link2('book/read/read');
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // this.getTabBar().init();
  },

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
