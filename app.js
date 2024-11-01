import updateManager from './common/updateManager';

App({
  globalData: {
    navBarHeight: 0,
    navBarTop: 0,
  },
  onLaunch: function () {
    const {
      height,
      top
    } = wx.getMenuButtonBoundingClientRect();
    this.globalData.navBarHeight = height
    this.globalData.navBarTop = top
  },
  onShow: function () {
    updateManager();
  },

});