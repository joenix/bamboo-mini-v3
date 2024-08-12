// components/custom-nav/custom-nav.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: '',
      observer: function (title) {
        this.setData({
          title
        })
      }
    },
    showBack: {
      type: Boolean,
      value: true,
      observer: function (showBack) {
        this.setData({
          showBack
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navBarHeight: 0,
    height: 14
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleBack() {
      wx.navigateBack()
    }
  },
  lifetimes: {
    ready() {
      // 获取应用实例
      const app = getApp();

      // 设置 navBarHeight
      this.setData({
        navBarHeight: (app.globalData.navBarHeight * 2) + this.data.height,
      });
    }
  },
})