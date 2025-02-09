const { getWxml, getStyle } = require('./config.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    canvasWidth: '',
    canvasHeight: '',
    imgVisible: false,
    imgSrc: '',
    info: {}
  },
  onShareAppMessage() {
    return {};
  },
  onLoad() {
    this.widget = this.selectComponent('.widget');
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', ({ data }) => {
      console.log(data);
      this.setData({ info: data });
    });
  },
  onImageVisibleChange(e) {
    this.setData({
      imgVisible: e.detail.visible
    });
  },
  async createShareImage() {
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
      });
    } catch (e) {
      this.showMessage('error', '图片生成失败');
    } finally {
      wx.hideLoading();
    }
  },
  renderToCanvas() {
    const that = this;
    const query = wx.createSelectorQuery();
    query.select('#main').boundingClientRect();
    query.select('#main').fields({
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
            wxml: getWxml(that.data.info),
            style
          });
          p1.then(resolve);
        }, 300);
      });
    });
  }
});
