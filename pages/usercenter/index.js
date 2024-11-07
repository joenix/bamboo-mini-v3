import { fetchUserCenter } from '../../services/usercenter/fetchUsercenter';
import { api, get, post, link2 } from '../../utils/util';

// 生成信息
const getDefaultData = () => {
  return {
    userInfo: {
      avatarUrl: '',
      nickname: '正在登录...',
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
    // this.fetUseriInfoHandle();
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
    // 2.1 本地存储 User 信息
    wx.setStorageSync('userInfo', userInfo);
    // 2.2 Mock
    this.setData({
      userInfo
    });
  },

  fetUseriInfoHandle() {
    fetchUserCenter().then(({ userInfo, countsData, customerServiceInfo }) => {
      this.setData({
        userInfo,
        customerServiceInfo,
        currAuthStep: 2
      });
      wx.stopPullDownRefresh();
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
        wx.navigateTo({
          url: '/usercenterPackage/pages/usercenter/score/score?score=' + userInfo.credits.credit || 0
        });
        break;
      }
      default: {
        break;
      }
    }
  },

  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.customerServiceInfo.servicePhone
    });
  },

  gotoUserEditPage() {
    const { currAuthStep } = this.data;
    if (currAuthStep === 2) {
      wx.navigateTo({
        url: '/usercenterPackage/pages/usercenter/person-info/index'
      });
    } else {
      this.fetUseriInfoHandle();
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
  }
});
