import { api, post, link2, wait } from '../../utils/util';
import Message from 'tdesign-miniprogram/message/index';

// 生成信息
const getDefaultData = () => {
  return {
    userInfo: {
      avatarUrl: '',
      nickname: '',
      mobile: ''
    },
    customerServiceInfo: {},
    currAuthStep: 1,
    versionNo: ''
  };
};

Page({
  data: getDefaultData(),
  onLoad() {
    this.getVersionInfo();
  },
  onShow() {
    this.getTabBar().init();
    this.init();
  },
  onPullDownRefresh() {
    this.init();
  },
  /**
   * Code by Joenix
   * ======== ======== ========
   */
  async init() {
    // 1. 校验本地 OpenID
    const token = wx.getStorageSync('token');
    if (!token) {
      return wx.redirectTo({
        url: '/pages/login/login'
      });
    }
    // 2. 根据 Token 获取 User 数据
    const userInfo = await post(api.User.info, {
      token
    });
    if (!userInfo) {
      this.showMessage('error', '获取用户信息失败,请重新登录');
      await wait(3000);
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }
    // 2.1 本地存储 User 信息
    wx.setStorageSync('userInfo', userInfo);
    // 2.2 Mock
    this.setData({
      userInfo
    });
  },
  onClickCell({ currentTarget }) {
    const { type } = currentTarget.dataset;

    switch (type) {
      // 学分兑换
      case 'exchange': {
        wx.navigateTo({
          url: '/usercenterPackage/pages/usercenter/exchange/exchange'
        });
        break;
      }
      // 我的学分
      case 'score': {
        const score = this.data.userInfo?.credits?.credit || 0;
        wx.navigateTo({
          url: '/usercenterPackage/pages/usercenter/score/score?score=' + score
        });
        break;
      }
      default: {
        break;
      }
    }
  },
  getVersionInfo() {
    const versionInfo = wx.getAccountInfoSync();
    const { version, envVersion = __wxConfig } = versionInfo.miniProgram;
    this.setData({
      versionNo: envVersion === 'release' ? version : envVersion
    });
  },
  link2sign() {
    link2('/usercenterPackage/pages/sign/sign');
  },
  logout() {
    wx.removeStorageSync('token');
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },
  onEditTap() {
    wx.navigateTo({
      url: '/usercenterPackage/pages/usercenter/profile/index'
    });
  },
  showMessage(type, content) {
    Message[type]({
      context: this,
      offset: [90, 32],
      duration: 3000,
      content
    });
  }
});
