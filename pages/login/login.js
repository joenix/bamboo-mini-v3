import { api, get, post, link2 } from '../../utils/util';
import { UpdateType, updateScoreAction } from '../../utils/score';
import Message from 'tdesign-miniprogram/message/index';

// pages/sign/sign.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    mobile: '13817152426',
    captcha: '',
    lock: false,
    phoneError: true
  },
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
  showError(message) {
    Message.error({
      context: this,
      offset: [90, 32],
      duration: 3000,
      content: message
    });
  },
  /* !!
   * Functionals
   * ======== ======== ========
   */
  async doLogin(e) {
    const { mobile, captcha } = this.data;
    if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(mobile)) {
      return this.showError('请检查手机号码');
    }
    if (captcha.length < 4) {
      return this.showError('验证码不能少于4位');
    }
    // 请求防抖
    if (this.data.lock) {
      return;
    }
    this.setData({
      lock: true
    });
    // 因为验证码没下来，先把验证码当密码用
    try {
      const token = await post(api.User.wx_login, {
        mobile,
        captcha
      });
      if (!token) {
        throw new Error('请检查账号和密码是否正确');
      }
      wx.removeStorageSync('token');
      wx.setStorageSync('token', token);
      const userInfo = await post(api.User.info, {
        token
      });
      wx.setStorageSync('userInfo', userInfo);
      await updateScoreAction(UpdateType.Login);
      wx.switchTab({
        url: '/pages/home/home'
      });
    } catch (e) {
      this.showError(typeof e === 'string' ? e : e.message);
    } finally {
      this.setData({
        lock: false
      });
    }
  }
});
