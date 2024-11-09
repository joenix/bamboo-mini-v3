// pages/tips/detail/detail.js
const { getWxml, getStyle } = require('./config.js');
import { Toast } from 'tdesign-miniprogram';

Page({
  data: {
    tipInfo: {},
    canvasWidth: '',
    canvasHeight: '',
    imgVisible: false,
    imgSrc: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const info = wx.getStorageSync('tipInfo');
    this.setData({
      tipInfo: info
    });
    this.widget = this.selectComponent('.widget');
  },
  onUnload() {
    wx.removeStorageSync('tipInfo');
  },
  onImageVisibleChange(e) {
    this.setData({
      imgVisible: e.detail.visible
    });
  },
  showToast(message) {
    Toast({
      context: this,
      selector: '#t-toast',
      message
    });
  },
  async save() {
    if (this.data.imgSrc) {
      this.setData({
        imgVisible: true
      });
      return;
    }
    wx.showLoading({
      title: '图片生成中...',
      mask: true
    });
    try {
      await this.renderToCanvas();
      const res = await this.widget.canvasToTempFilePath();
      const src = res.tempFilePath;
      this.setData({
        imgSrc: src,
        imgVisible: true
      })
    } catch (e) {
      this.showToast('图片生成失败');
    } finally {
      wx.hideLoading();
    }
  },
  renderToCanvas() {
    const that = this;
    const query = wx.createSelectorQuery();
    query.select('#content').boundingClientRect();
    query.select('#content').fields({
      computedStyle: ['fontFamily']
    });
    return new Promise((resolve) => {
      query.exec((res) => {
        const { canvasWidth, canvasHeight, style } = getStyle(res);
        that.setData({
          canvasWidth,
          canvasHeight
        });
        setTimeout(() => {
          const p1 = this.widget.renderToCanvas({
            wxml: getWxml(that.data.tipInfo.content),
            style
          });
          p1.then(resolve);
        }, 300);
      });
    });
  },
});
