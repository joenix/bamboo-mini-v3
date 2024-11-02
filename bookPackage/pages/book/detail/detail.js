// pages/book/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    musicVisible: false,
    musiceOptions: [{
        label: '隐形的翅膀',
        value: '1'
      },
      {
        label: '青花瓷',
        value: '2'
      },
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    const {
      id
    } = options

    this.setData({
      id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  chooseMusic() {
    this.setData({
      musicVisible: true
    })
  },
  beginread() {
    wx.navigateTo({
      url: "/bookPackage/pages/book/time/time"
    })
  }
})