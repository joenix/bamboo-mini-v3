import { fetchUserCenter } from '../../services/usercenter/fetchUsercenter';
import Toast from 'tdesign-miniprogram/toast/index';

const menuData = [
  [
    {
      title: '每日签到',
      tit: '去签到',
      url: '',
      type: 'sign',
      leftIcon: 'tips'
    },
    {
      title: '我的学分',
      tit: '2733',
      url: '',
      type: 'score',
      leftIcon: 'education'
    },
    {
      title: '学分兑换',
      tit: '',
      url: '',
      type: 'exchange',
      leftIcon: 'currency-exchange'
    },
    {
      title: '资料更新',
      tit: '报告即将生成,请尽快更新个人资料',
      url: '',
      type: 'files',
      leftIcon: 'notification'
    },
    {
      title: '我的报告',
      tit: '月度报告已生成',
      url: '',
      type: 'report',
      leftIcon: 'chat-bubble-smile'
    },
    {
      title: '意见反馈',
      tit: '',
      url: '',
      type: 'suggest',
      leftIcon: 'send'
    },
    {
      title: '关于我们',
      tit: '',
      url: '',
      type: 'aboutus',
      leftIcon: 'member'
    }
  ]
];

const orderTagInfos = [
  {
    title: '待付款',
    iconName: 'wallet',
    orderNum: 0,
    tabType: 5,
    status: 1
  },
  {
    title: '待发货',
    iconName: 'deliver',
    orderNum: 0,
    tabType: 10,
    status: 1
  },
  {
    title: '待收货',
    iconName: 'package',
    orderNum: 0,
    tabType: 40,
    status: 1
  },
  {
    title: '待评价',
    iconName: 'comment',
    orderNum: 0,
    tabType: 60,
    status: 1
  },
  {
    title: '退款/售后',
    iconName: 'exchang',
    orderNum: 0,
    tabType: 0,
    status: 1
  }
];

const getDefaultData = () => ({
  showMakePhone: false,
  userInfo: {
    avatarUrl: '',
    nickName: '正在登录...',
    phoneNumber: ''
  },
  menuData,
  orderTagInfos,
  customerServiceInfo: {},
  currAuthStep: 1,
  showKefu: true,
  versionNo: '',

  // Test
  mine_type: 1
});

Page({
  // Test
  updateType(e) {
    const { go: mine_type } = e.currentTarget.dataset;

    this.setData({
      mine_type
    });
  },

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

  init() {
    this.fetUseriInfoHandle();
  },

  fetUseriInfoHandle() {
    fetchUserCenter().then(({ userInfo, countsData, orderTagInfos: orderInfo, customerServiceInfo }) => {
      // eslint-disable-next-line no-unused-expressions
      menuData?.[0].forEach((v) => {
        countsData.forEach((counts) => {
          if (counts.type === v.type) {
            // eslint-disable-next-line no-param-reassign
            v.tit = counts.num;
          }
        });
      });
      const info = orderTagInfos.map((v, index) => ({
        ...v,
        ...orderInfo[index]
      }));
      this.setData({
        userInfo,
        menuData,
        orderTagInfos: info,
        customerServiceInfo,
        currAuthStep: 2
      });
      wx.stopPullDownRefresh();
    });
  },

  onClickCell({ currentTarget }) {
    const { type } = currentTarget.dataset;

    switch (type) {
      // 签到
      case 'sign': {
        wx.navigateTo({
          url: '/pages/sign/sign'
        });
        break;
      }
      // 意见反馈
      case 'suggest': {
        wx.navigateTo({
          url: '/pages/usercenter/suggest/suggest'
        });
        break;
      }
      // 关于我们
      case 'aboutus': {
        wx.navigateTo({
          url: '/pages/usercenter/aboutus/aboutus'
        });
        break;
      }
      // 我的报告
      case 'report': {
        wx.navigateTo({
          url: '/pages/usercenter/report/report'
        });
        break;
      }
      // 资料更新
      case 'files': {
        wx.navigateTo({
          url: '/pages/usercenter/files/files'
        });
        break;
      }

      // 学分兑换
      case 'exchange': {
        wx.navigateTo({
          url: '/pages/usercenter/exchange/exchange'
        });
        break;
      }

      // 我的学分
      case 'score': {
        wx.navigateTo({
          url: '/pages/usercenter/score/score'
        });
        break;
      }
      case 'address': {
        wx.navigateTo({
          url: '/pages/usercenter/address/list/index'
        });
        break;
      }

      case 'point': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '你点击了积分菜单',
          icon: '',
          duration: 1000
        });
        break;
      }
      case 'coupon': {
        wx.navigateTo({
          url: '/pages/coupon/coupon-list/index'
        });
        break;
      }
      default: {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '未知跳转',
          icon: '',
          duration: 1000
        });
        break;
      }
    }
  },

  jumpNav(e) {
    const status = e.detail.tabType;

    if (status === 0) {
      wx.navigateTo({
        url: '/pages/order/after-service-list/index'
      });
    } else {
      wx.navigateTo({
        url: `/pages/order/order-list/index?status=${status}`
      });
    }
  },

  jumpAllOrder() {
    wx.navigateTo({
      url: '/pages/order/order-list/index'
    });
  },

  openMakePhone() {
    this.setData({
      showMakePhone: true
    });
  },

  closeMakePhone() {
    this.setData({
      showMakePhone: false
    });
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
        url: '/pages/usercenter/person-info/index'
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

  loginout() {
    console.log('loginout');
  }
});
