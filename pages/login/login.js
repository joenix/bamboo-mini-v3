import { api, get, post, link2 } from '../../utils/util';
import Message from 'tdesign-miniprogram/message/index';

// pages/sign/sign.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    bgImage: 'https://oss.lhdd.club/ui/bg.jpg',

    mobile: '',
    captcha: '',

    lock: false,

    phoneError: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  onMobileChange(e) {
    const mobile = e.detail.value;

    this.setData({
      mobile
    });
  },

  onCaptchaChange(e) {
    const captcha = e.detail.value;

    this.setData({
      captcha
    });
  },

  /* !!
   * Functionals
   * ======== ======== ========
   */
  async doLogin(e) {
    const { mobile, captcha } = this.data;

    if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(mobile)) {
      return Message.error({
        context: this,
        offset: [90, 32],
        duration: 3000,
        content: '请检查手机号码'
      });
    }

    if (captcha.length < 4) {
      return Message.error({
        context: this,
        offset: [90, 32],
        duration: 3000,
        content: '验证码不能少于4位'
      });
    }

    // 请求防抖
    if (this.data.lock) {
      return;
    }

    this.setData({
      lock: true
    });

    // 因为验证码没下来，先把验证码当密码用
    const token = await post(api.User.wx_login, { mobile, captcha });

    if (!token) {
      return Message.error({
        context: this,
        offset: [90, 32],
        duration: 3000,
        content: '请检查账号和密码是否正确'
      });
    }

    wx.removeStorageSync('token');
    wx.setStorageSync('token', token);

    wx.switchTab({
      url: '/pages/home/home'
    });
  }
});
