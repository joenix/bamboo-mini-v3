import {
  lunar,
  api,
  post,
  link2
} from '../../utils/util';
import dayjs from 'dayjs';

// pages/book/book.js
function getCommonData(month, disable) {
  return {
    minDate: month.startOf("month").valueOf(),
    maxDate: month.endOf("month").valueOf(),
    curerntDate: month.endOf("month").valueOf(),
    currentYearMonthStr: month.format('YYYY/MM'),
    disableNext: disable
  }
}

const initData = getCommonData(dayjs(), true)

Page({
  /**
   * 页面的初始数据
   */
  data: {
    calendarValue: dayjs().valueOf(),
    ...initData,
    format(current) {
      const {
        date
      } = current;

      if (dayjs(date) > dayjs()) {
        current.type = 'disabled'
      }

      // 年
      const year = date.getFullYear();
      // 月
      const month = date.getMonth() + 1;
      // 日
      const today = date.getDate();
      // 周几
      const week_day = date.getDay();
      // 农历
      const {
        dayStr,
        day,
        monthStr
      } = lunar.solarToLunar(year, month, today);
      let newClassName = [];
      if (week_day === 0) {
        newClassName.push('sunday')
      }
      if (week_day === 6) {
        newClassName.push('saturday');
      }
      if ([1, 22, 27, 30].includes(day)) {
        newClassName.push('is-readed');
      }
      current.className = (current.className || "") + ' ' + newClassName.join(' ');
      // 日期
      current.suffix = dayStr;
      // Update
      return current;
    },
    listData: [],
  },
  prevMonth() {
    const current = this.data.curerntDate;
    const month = dayjs(current).subtract(1, 'month');
    const data = getCommonData(month, false);
    this.setData(data);
  },
  nextMonth() {
    if (this.data.disableNext) {
      return;
    }
    const current = this.data.curerntDate;
    const month = dayjs(current).add(1, 'month');
    const data = getCommonData(month, month >= dayjs());
    this.setData(data);
  },
  toToday() {
    this.setData({
      calendarValue: dayjs().valueOf(),
      ...initData
    });
  },
  handleSelect(e) {
    const {
      value
    } = e.detail;
    this.setData({
      calendarValue: value,
    })
  },

  link_ranking() {
    link2('/bookPackage/pages/book/ranking/ranking');
  },
  link_read() {
    link2('/bookPackage/pages/book/read/read');
  },
  startLearn() {
    link2('/bookPackage/pages/book/learn/learn');
  },
  onButtonTap(e) {
    const data = e.currentTarget.dataset.item
    if (data.status === 1) {
      this.link_read()
      return;
    }
    // todo: 未激活
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      listData: [{
        name: "诫子书",
        suggestion: "建议单次时长45分",
        userNum: 99,
        count: 0,
        time: 0,
        status: 1
      }, {
        name: "诫外甥书",
        suggestion: "建议单次时长45分",
        userNum: 99,
        count: 0,
        time: 0,
        status: 0
      }]
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getTabBar().init();
  },
});