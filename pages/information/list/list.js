// pages/welcome/welcome.js
Page({
  // 跳转咨询页面
  jump2information(e) {
    const {
      currentTarget: {
        dataset: {
          id
        }
      }
    } = e
    if (id) {
      // 跳转到具体的咨询详情页面
      wx.navigateTo({
        url: `/pages/information/detail/detail?id=${id}`,
      })
    }
  },
});