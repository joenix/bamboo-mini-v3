// pages/usercenter/suggest/suggest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    autosize: {
      maxHeight: 200,
      minHeight: 100,
    },
    suggestion: ''
  },
  onChange(e) {
    const value = e.detail.value
    this.setData({
      suggestion: value
    })
  },
  onSubmit() {
    console.log(this.data.suggestion);
  }
})