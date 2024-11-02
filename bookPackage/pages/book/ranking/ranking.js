// pages/book/ranking/ranking.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 'today',
    listData: [],
    top3ListData: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const list = new Array(15).fill({
      name: '书书',
      time: '20'
    });
    this.setData({
      listData: list.slice(3),
      top3ListData: list.slice(0, 3)
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab
    });
  },
  linkBack() {
    wx.navigateBack();
  }
});