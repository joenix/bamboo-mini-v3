import { api, post, formatTime } from '../../utils/util';

Page({
  data: {
    indexs: [],
    selectIdx: 0,
    viewId: '',
    tips: [
      {
        index: '今日贴士',
        id: 'today',
        children: []
      },
      {
        index: '本周贴士',
        id: 'week',
        children: []
      },
      {
        index: '本月贴士',
        id: 'month',
        children: []
      }
    ],
    opens: [0],
    stickyOffset: 0
  },

  onLoad() {
    this.setData({
      indexs: this.data.tips.map((item) => item.index),
      viewId: this.data.tips[0].id
    });
  },
  onShow() {
    this.getTabBar().init();
    this.getTips();
  },
  onSelect(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectIdx: index,
      viewId: this.data.tips[index].id
    });
  },
  onControl(event) {
    const { index } = event.currentTarget.dataset;
    const value = this.data.opens[index] || false;

    this.data.opens[index] = !value;

    this.setData({
      opens: this.data.opens
    });
  },
  onPullDownRefresh() {
    this.getTips();
  },
  async getTips() {
    const { data } = await post(api.Tips.getall);

    const now = new Date().getTime();
    const day = now + 1000 * 60 * 60 * 24;

    data.forEach((item, index) => {
      const time = new Date(item.updatedAt).getTime();
      item.updatedAt = formatTime(item.updatedAt, 'YYYY年MM月DD日');

      if (time <= day * 1) {
        this.data.tips[0].children.push(item);
      }

      if (time > day * 1 && time <= day * 7) {
        this.data.tips[1].children.push(item);
      }

      if (time > day * 7 && time <= day * 30) {
        this.data.tips[2].children.push(item);
      }

      // 补丁
      this.data.opens[index] = false;
    });

    console.log(this.data.tips);

    this.setData({
      tips: this.data.tips
    });
  },
  jump2Detail(e) {
    const info = e.currentTarget.dataset.info;
    wx.setStorageSync('tipInfo', info);
    wx.navigateTo({
      url: `/pages/tips/detail/detail`
    });
  }
});
