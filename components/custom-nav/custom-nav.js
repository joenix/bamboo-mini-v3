// components/custom-nav/custom-nav.js
const app = getApp()
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
        });
      }
    },
    showBack: {
      type: Boolean,
      value: true,
      observer: function (showBack) {
        this.setData({
          showBack
        });
      }
    },
    background: {
      type: String,
      value: '#fff'
    },
    white: {
      type: Boolean,
      value: false
    },
    center: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    containerStyle: "",
    titleStyle: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleBack() {
      wx.navigateBack();
    }
  },
  lifetimes: {
    ready() {
      this.setData({
        containerStyle: `
          padding-top: ${app.globalData.navBarTop}px;
          background-color: ${this.data.background};
          color: ${this.data.white ? " #FFF" : "#000" };
          `,
        titleStyle: `
          height: ${app.globalData.navBarHeight}px;
          line-height: ${app.globalData.navBarHeight}px;
          text-align: ${this.data.center ? 'center': 'left'};
          text-indent: ${ this.data.center && this.data.showBack ? '-56rpx' : '' };
        `
      });
    }
  }
});