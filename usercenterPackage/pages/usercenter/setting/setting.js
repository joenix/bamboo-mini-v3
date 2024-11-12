// usercenterPackage/pages/usercenter/setting/setting.js
import Message from 'tdesign-miniprogram/message/index';
import { wait } from '../../../../utils/util';

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
  async clearCache() {
    wx.removeStorageSync('loginRedirectUrl')
    this.showMessage('success', '清除成功')
    await wait(3000)
    wx.navigateBack()
  },
  showMessage(type, content) {
    Message[type]({
      context: this,
      offset: [90, 32],
      duration: 3000,
      content
    });
  }
})