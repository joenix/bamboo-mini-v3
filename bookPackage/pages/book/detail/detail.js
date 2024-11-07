// pages/book/detail/detail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    musicVisible: false,
    musiceOptions: [
      {
        label: '隐形的翅膀',
        value: '1'
      },
      {
        label: '青花瓷',
        value: '2'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    const { id } = options;

    this.setData({
      id
    });
  },
  chooseMusic() {
    this.setData({
      musicVisible: true
    });
  },
  beginread() {
    wx.navigateTo({
      url: '/bookPackage/pages/book/time/time'
    });
  }
});
