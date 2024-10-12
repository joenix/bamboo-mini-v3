import dayjs from 'dayjs';
import { api, get, post, formatTime } from '../../utils/util';

import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    indexs: [],
    tips: [
      {
        index: '今日贴士',
        children: []
      },
      {
        index: '本周贴士',
        children: []
      },
      {
        index: '本月贴士',
        children: []
      }
    ],
    opens: [0],
    stickyOffset: 0
  },

  onLoad() {
    this.getTips();
  },

  onReady() {
    this.setData({
      indexs: this.data.tips.map((item) => item.index)
    });
  },

  onSelect(e) {
    const { index } = e.detail;

    console.log(index);
  },

  onShow() {
    this.getTabBar().init();
  },

  onControl(event) {
    const { index } = event.currentTarget.dataset;
    const value = this.data.opens[index] || false;

    this.data.opens[index] = !value;

    this.setData({
      opens: this.data.opens
    });
  },

  onPullDownRefresh() {},

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

    this.setData({
      tips: this.data.tips
    });
  },

  getCustomNavbarHeight() {
    const query = wx.createSelectorQuery();
    query.select('.custom-navbar').boundingClientRect();
    query.exec((res) => {
      const { height = 0 } = res[0] || {};
      this.setData({ stickyOffset: height });
    });
  },

  jump2Tips(e) {
    const {
      currentTarget: {
        dataset: { id }
      }
    } = e;

    wx.navigateTo({
      url: `/pages/tips/detail/detail?id=${id}`
    });
  }
});
