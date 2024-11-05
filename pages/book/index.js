import {
  lunar,
  api,
  post,
  link2
} from '../../utils/util';
import dayjs from 'dayjs';
import {
  Toast
} from 'tdesign-miniprogram';

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

const generateFormatFn = (readDates = []) => {
  return (current) => {
    const {
      date
    } = current;
    if (dayjs(date) > dayjs()) {
      current.type = 'disabled'
    }
    const newClassName = [current.className || ""];
    const week_day = date.getDay();
    if (week_day === 0) {
      newClassName.push('sunday')
    }
    if (week_day === 6) {
      newClassName.push('saturday');
    }
    if (readDates.some(v => dayjs(v).isSame(date, 'day'))) {
      newClassName.push('is-readed');
    }
    current.className = newClassName.join(' ');
    // 农历日期
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const today = date.getDate();
    const {
      dayStr
    } = lunar.solarToLunar(year, month, today);
    current.suffix = dayStr;
    // Update
    return current;
  }
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    calendarValue: dayjs().valueOf(),
    ...initData,
    format: generateFormatFn(),
    listData: [],
    activePopupShow: false,
    bookId: '',
    activeCode: ''
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
  link_read(bookId) {
    link2('/bookPackage/pages/book/read/read?bookId=' + bookId);
  },
  startLearn() {
    link2('/bookPackage/pages/book/learn/learn');
  },
  onButtonTap(e) {
    const data = e.currentTarget.dataset.item
    const bookId = data.id
    if (data.active) {
      this.link_read(bookId)
      return;
    }
    this.setData({
      activePopupShow: true,
      bookId
    })
  },
  onVisibleChange(e) {
    this.setData({
      activePopupShow: e.detail.visible,
    });
  },
  onActiveCodeChange(e) {
    this.setData({
      activeCode: e.detail.value
    })
  },
  showToast(e) {
    const message = typeof e === 'string' ? e : e.message
    Toast({
      context: this,
      selector: '#t-toast',
      message,
    });
  },
  async activeBook() {
    const code = this.data.activeCode;
    if (!code.trim()) {
      this.showToast('请输入激活码');
      return;
    }
    const userInfo = wx.getStorageSync('userInfo');
    const bookId = this.data.bookId;
    try {
      await post(api.Read.avtiveBook, {
        bookId,
        code,
        userId: userInfo.id
      });
    } catch (e) {
      this.showToast(e)
      return;
    }
    this.showToast('激活成功');
    const newListData = this.data.listData.map(v => {
      return v.id === bookId ? {
        ...v,
        active: true
      } : v
    })
    this.setData({
      activePopupShow: false,
      listData: newListData
    })
  },
  goShop() {
    // TODO
    this.showToast('暂未开通');
  },
  async initPage() {
    const [bookList, records] = await Promise.all([
      post(api.Read.books),
      post(api.Read.records)
    ]);
    const recordDates = records?.data?.map(v => dayjs(+v)) || [];
    this.setData({
      listData: bookList?.data?.map(v => ({
        ...v,
        today_time: Number((v.today_time / 3600).toFixed(2))
      })) || [],
      format: generateFormatFn(recordDates)
    })
  },
  onLoad() {
    this.getTabBar().init();
  },
  onShow() {
    this.initPage()
  },
  onPullDownRefresh() {
    this.initPage();
  },
});