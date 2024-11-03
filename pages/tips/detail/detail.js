// pages/tips/detail/detail.js
const {
  getWxml,
  getStyle
} = require('./config.js')
import {
  Toast
} from 'tdesign-miniprogram';

Page({
  data: {
    content: '',
    canvasWidth: '',
    canvasHeight: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.widget = this.selectComponent('.widget');
    const info = wx.getStorageSync('tipInfo')
    this.setData({
      content: info.content
    })
  },
  onUnload() {
    wx.removeStorageSync('tipInfo')
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      // title: ""
    }
  },
  showToast(message) {
    Toast({
      context: this,
      selector: '#t-toast',
      message,
    });
  },
  async save() {
    console.log('保存图片')
    try {
      await this.renderToCanvas();
      const res = await this.widget.canvasToTempFilePath()
      const src = res.tempFilePath
      wx.saveImageToPhotosAlbum({
        filePath: src,
        success: () => {
          this.showToast('保存成功');
        },
        fail: (res) => {
          console.log(res)
          if (res.errMsg === "saveImageToPhotosAlbum:fail cancel") {
            this.showToast('保存已取消');
            return;
          }
          this.showToast('保存失败');
        }
      })
    } catch (e) {
      this.showToast('保存失败');
    }
  },
  renderToCanvas() {
    const that = this;
    const query = wx.createSelectorQuery()
    query.select('#content').boundingClientRect();
    query.select('#content').fields({
      computedStyle: ['fontFamily'],
    });
    return new Promise((resolve) => {
      query.exec((res) => {
        const {
          canvasWidth,
          canvasHeight,
          style
        } = getStyle(res)
        that.setData({
          canvasWidth,
          canvasHeight
        })
        setTimeout(() => {
          const p1 = this.widget.renderToCanvas({
            wxml: getWxml(that.data.content),
            style
          })
          p1.then(resolve)
        }, 300)
      })
    })
  }
})