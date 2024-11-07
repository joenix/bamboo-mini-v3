import dayjs from 'dayjs';
import Message from 'tdesign-miniprogram/message/index';
import { UpdateType, updateScoreAction } from '../../../utils/score';

const today = dayjs().format('YYYY-MM-DD');

Page({
  data: {
    checkInDays: 0
  },
  onLoad: function () {
    const checkInDays = wx.getStorageSync('checkInDays');
    const diffDays = getDiffDays();
    this.setData({ checkInDays: diffDays > 1 ? 0 : checkInDays || 0 });
  },
  getDiffDays: function () {
    const lastCheckedDate = wx.getStorageSync('lastCheckedDate');
    const diffDays = dayjs(today).diff(dayjs(lastCheckedDate), 'day');
    return diffDays;
  },
  // 签到按钮点击事件
  onSign: async function () {
    if (this.submiting) {
      return;
    }
    this.submiting = true;

    const lastCheckedDate = wx.getStorageSync('lastCheckedDate');
    if (today === lastCheckedDate) {
      wx.showToast({ title: '今天已经签到过了！' });
      return;
    }

    this.showLoading({
      title: '签到中...'
    });

    try {
      await updateScoreAction(UpdateType.Sign);
      let newCheckInDays = 0;
      if (!lastCheckedDate) {
        // 第一次签到
        newCheckInDays = 1;
      } else {
        const diffDays = this.getDiffDays();
        // diffDays === 1 连续签到
        newCheckInDays = diffDays === 1 ? this.data.checkInDays + 1 : 1;
      }
      this.setData({ checkInDays: newCheckInDays });
      wx.setStorageSync('lastCheckedDate', today);
      wx.setStorageSync('checkInDays', newCheckInDays);
      this.showMessage('success', '签到成功');
    } catch (error) {
      console.log(error);
      this.showMessage('error', '签到失败');
    } finally {
      this.hideLoading();
      this.submiting = false;
    }
  },
  showMessage(type, content) {
    Message[type]({
      context: this,
      offset: [90, 32],
      duration: 3000,
      content: content
    });
  },
  todoTask() {
    wx.navigateTo({
      url: '/pages/book/index'
    });
  }
});
