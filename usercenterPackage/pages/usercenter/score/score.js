// pages/usercenter/suggest/suggest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    score: 289,
    total: 4000,
    listData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(1213);
    this.setData({
      listData: [{
        name: '点读任务',
        time: '2024-09-21',
        score: '100'
      }]
    })
  },
})