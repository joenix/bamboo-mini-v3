// pages/book/book.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    format(day) {
      const {
        date
      } = day;
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const curDate = date.getDate();

      day.suffix = '¥60';

      const map = {
        1: '初一',
        2: '初二',
        3: '初三',
        14: '情人节',
        15: '元宵节',
      };
      if (curDate in map) {
        day.prefix = map[curDate];
        day.suffix = '¥100';
        day.className = 'is-holiday';
      }
      return day;
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getTabBar().init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  jump2rank() {
    wx.navigateTo({
      url: "/pages/book/ranking/ranking"
    })
  },
  beginread(e) {
    const {
      currentTarget: {
        dataset: {
          id
        }
      }
    } = e
    wx.navigateTo({
      url: `/pages/book/detail/detail?id=${id}`
    })
  }
})