import Toast from 'tdesign-miniprogram/toast/index';


Page({
  data: {

  },

  onLoad() {},

  onShow() {
    this.getTabBar().init();
  },
  onPullDownRefresh() {},

  jump2Tips(e) {
    const {
      currentTarget: {
        dataset: {
          id
        }
      }
    } = e
    wx.navigateTo({
      url: `/pages/tips/detail/detail?id=${id}`
    })
  }
});