import TabMenu from './data';
import { checkToken } from '../utils/util';

const app = getApp();

Component({
  data: {
    active: 0,
    list: TabMenu
  },
  lifetimes: {
    attached() {
      this.setData({
        active: app.globalData.selectedTab
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
      if (!checkToken()) {
        wx.setStorageSync('loginRedirectUrl', `/${url}`);
        wx.navigateTo({
          url: '/pages/login/login'
        });
        return;
      }
      wx.switchTab({
        url: `/${url}`
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
