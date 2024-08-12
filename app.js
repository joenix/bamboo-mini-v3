import updateManager from './common/updateManager';

App({
  globalData: {
    navBarHeight: 0
  },
  onLaunch: async function () {
    const info = await wx.getSystemInfo()
    this.globalData.navBarHeight = info.statusBarHeight
  },
  onShow: function () {
    updateManager();
  },

});