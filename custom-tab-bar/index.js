import TabMenu from './data';
import { checkToken } from '../utils/util';

Component({
  data: {
    active: 0,
    list: TabMenu
  },
  methods: {
    onChange(event) {
      if (!checkToken()) {
        wx.navigateTo({
          url: '/pages/login/login'
        });
        return;
      }
      const index = event.detail.value;
      if (index === this.data.active) return;
      this.setData({
        active: index
      });
      const url = this.data.list[index].url;
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
