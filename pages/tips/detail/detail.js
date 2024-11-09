// pages/tips/detail/detail.js
const { getWxml, getStyle } = require('./config.js');
import { Toast } from 'tdesign-miniprogram';

const pagePath = '/pages/tips/detail/detail';

Page({
  data: {
    tipInfo: {},
    canvasWidth: '',
    canvasHeight: '',
    visible: false,
    canSaveImage: false,
    imgVisible: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return;
    }
    const options = wx.getLaunchOptionsSync();
    const {path, scene, query} = options;
    this.formShare = `/${path}` === pagePath && scene === 1007
    if (this.formShare) {
      this.getTipInfoById(query.id);
    } else {
      const info = wx.getStorageSync('tipInfo');
      this.setData({
        tipInfo: info
      });
    }
    this.getSaveSetting();
    this.widget = this.selectComponent('.widget');
  },
  onUnload() {
    wx.removeStorageSync('tipInfo');
  },
  onShareAppMessage() {
    return {
      // title: ""
      path: `${pagePath}?id=${this.data.tipInfo.id}`
    };
  },
  goToIndex() {
    if (!this.formShare) {
      return;
    }
    wx.switchTab({
      url: '/pages/tips/index',
    })
  },
  getTipInfoById() {
    this.setData({
      tipInfo: {
        content: '121313'
      }
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
    if (!this.data.canSaveImage) {
      this.setData({
        visible: true
      });
      return;
    }
    wx.showLoading({
      title: '图片生成中...',
      mask: true
    });
    console.log('保存图片');
    try {
      await this.renderToCanvas();
      const res = await this.widget.canvasToTempFilePath();
      const src = res.tempFilePath;
      wx.saveImageToPhotosAlbum({
        filePath: src,
        success: () => {
          this.showToast('保存成功');
        },
        fail: (res) => {
          console.log(res);
          if (res.errMsg.indexOf('auth deny') >= 0) {
            this.setData({
              visible: true
            });
            return;
          }
          if (res.errMsg === 'saveImageToPhotosAlbum:fail cancel') {
            this.showToast('保存已取消');
            return;
          }
          this.showToast('保存失败');
        }
      });
    } catch (e) {
      this.showToast('保存失败');
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
  getSaveSetting() {
    wx.getSetting({
      success: (res) => {
        const can = res.authSetting['scope.writePhotosAlbum'];
        this.setData({
          canSaveImage: can
        });
        if (!can) {
          this.setData({
            visible: true
          });
        }
      }
    });
  },
  openSetting() {
    wx.openSetting({
      success: (res) => {
        console.log(res.authSetting);
        this.setData({
          canSaveImage: res.authSetting['scope.writePhotosAlbum']
        });
      }
    });
    this.setData({
      visible: false
    });
  }
});
