// pages/usercenter/suggest/suggest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sexVisible: false,
    sexOptions: [{
        label: '男',
        value: '1'
      },
      {
        label: '女',
        value: '2'
      },
    ],
    dateVisible: false,
    birthday: '1990-02-04',
    sex: '男'

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
  onShow: function () {

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
  chooseSex() {
    this.setData({
      sexVisible: !this.sexVisible
    })
  },
  sexChange(e) {
    const {
      value,
      label
    } = e.detail


    this.setData({
      sex: label[0]
    })
  },

  chooseBirthday() {
    this.setData({
      dateVisible: !this.dateVisible
    })
  },

  dateChange(e) {
    this.setData({
      birthday: e.detail.value
    })
  }
})