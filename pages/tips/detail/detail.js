// pages/tips/detail/detail.js
Page({
  data: {
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const {
      id
    } = options
    this.widget = this.selectComponent('.widget')
    this.setData({
      id
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      // title: ""
    }
  },
  save() {
    console.log('保存图片')
    wx.saveImageToPhotosAlbum({
      success(res) {}
    })
  },
})