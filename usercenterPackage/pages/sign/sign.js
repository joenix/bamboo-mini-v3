import Message from 'tdesign-miniprogram/message/index';
import {
  formatTime,
  dayjs,
  day1,
  stream1
} from '../../../utils/util';

// pages/sign/sign.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 签到集合
    checks: [],
    // 连续签到
    continous: 0,
    // 今日是否签到
    isSign: false,
    // 今天
    today: ''
  },

  // 从本地获取数据
  async init() {
    let checks = wx.getStorageSync('checks') || [];
    let continous = wx.getStorageSync('continous') || 0;
    let isSign = wx.getStorageSync('isSign') || false;

    // 今天
    this.setData({
      today: formatTime(new Date(), 'YYYY-MM-DD')
    });

    checks = this.onInitDates(this.data.today, checks);
    continous = this.onCalculateContinous(continous, checks);

    // 如果中间有任何断档，直接清零
    for (const index in checks) {
      const item = checks[index];

      // 设置日期
      const theDay = new Date(item.date).getTime();
      const toDay = new Date(this.data.today).getTime();

      if (theDay == toDay) {
        isSign = item.checked;
        break;
      }

      // 超出今天，不作计算
      if (theDay > toDay) {
        break;
      }

      // 满额重置
      if (index == 6 && item.checked === true && toDay > theDay) {
        checks = this.onInitDates(this.data.today, []);
        continous = 0;
        isSign = false;
        break;
      }

      // 断档重置
      if (item.checked !== true) {
        checks = this.onInitDates(this.data.today, []);
        continous = 0;
        isSign = false;
        break;
      }
    }

    this.onSave({
      checks,
      continous,
      isSign
    });
  },

  // 初始化日期
  onInitDates(today, checks = [], max = 7) {
    // 如果空置，初始化当天日期
    if (!checks.length) {
      checks[0] = {
        checked: false,
        date: today
      };
    }

    // 初始化 7天 集合
    for (let i = 0; i < max; i++) {
      if (i) {
        const last = i - 1;
        const date = new Date(checks[last].date).getTime() + day1;
        const checked = checks[i] ? checks[i].checked : false;

        checks[i] = {
          checked,
          date: formatTime(new Date(date), 'YYYY-MM-DD')
        };
      }
    }

    // 返回数据
    return checks;
  },

  // 计算累计
  onCalculateContinous(continous = 0, checks = []) {
    for (const item of checks) {
      if (item.checked === true) {
        continous++;
      } else {
        break;
      }
    }

    return continous;
  },

  // 点击签到
  onSign(e) {
    const {
      item,
      index
    } = e.currentTarget.dataset;

    if (item.date !== this.data.today) {
      return;
    }

    if (this.data.isSign) {
      return Message.warning({
        context: this,
        offset: [90, 32],
        duration: 3000,
        content: '今天已经签过到了'
      });
    }

    this.data.checks[index].checked = true;
    this.data.isSign = true;

    // 更新 Checks
    this.onSave({
      checks: this.data.checks,
      isSign: this.data.isSign
    });

    return Message.success({
      context: this,
      offset: [90, 32],
      duration: 3000,
      content: '签到成功'
    });
  },

  // 数据存储
  onSave(data) {
    for (const key in data) {
      this.setData({
        [key]: data[key]
      });

      wx.setStorageSync(key, data[key]);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 先获取本地数据
    await this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
});