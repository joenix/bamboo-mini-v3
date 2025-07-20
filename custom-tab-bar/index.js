import TabMenu from './data';
import { checkToken, post } from '../utils/util';

const app = getApp();

Component({
  data: {
    active: 0,
    list: TabMenu,
    needLogin: false
  },
  lifetimes: {
    attached() {
      this.setData({
        active: app.globalData.selectedTab
      });
    },

    ready() {
      const pages = getCurrentPages();
      const { route } = pages[pages.length - 1];
      let needLogin = ['pages/book/index', 'pages/usercenter/index'].includes(route);

      if (needLogin) {
        needLogin = !checkToken();
      }

      this.setData({
        needLogin
      });
    }
  },

  methods: {
    onChange(event) {
      const index = event.detail.value;
      if (index === this.data.active) return;
      app.globalData.selectedTab = index;
      this.setData({
        active: index
      });
      const url = this.data.list[index].url;

      wx.switchTab({
        url: `/${url}`
      });

      return;
      if (!checkToken()) {
        wx.setStorageSync('loginRedirectUrl', `/${url}`);
        wx.navigateTo({
          // url: '/pages/login/login'
          url: '/pages/welcome/welcome'
        });
        return;
      }
    },

    async onGetPhoneNumber(e) {
      if (e.detail.errMsg === 'getPhoneNumber:ok') {
        const session_key = wx.getStorageSync('session_key');
        const openid = wx.getStorageSync('openid');

        const { purePhoneNumber: mobile } = await post('/wx/phone', {
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          session_key
        });

        const token = await post('/wx/mnp_login', { mobile, openid });
        wx.setStorageSync('token', token);

        // 隐藏按钮
        this.setData({
          needLogin: false
        });

        // wx.switchTab({
        //   // url: '/pages/home/home' // 跳转到首页
        //   url: getCurrentPages()
        // });

        const page = getCurrentPages().pop();

        wx.navigateTo({
          url: '/pages/refresh/refresh?target=' + encodeURIComponent(page.route)
        });

        return;
      }

      await wx.showToast({
        title: '授权失败，即将返回首页',
        icon: 'none',
        duration: 3000
      });
    },

    init() {
      const page = getCurrentPages().pop();
      const route = page ? page.route.split('?')[0] : '';
      const active = this.data.list.findIndex((item) => item.url === `${route}`);
      this.setData({
        active
      });
    }
  }
});
