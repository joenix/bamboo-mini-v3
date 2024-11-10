// pages/usercenter/suggest/suggest.js
import Message from 'tdesign-miniprogram/message/index';
import { wait } from '../../../../utils/util';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    autosize: {
      maxHeight: 200,
      minHeight: 100
    },
    suggestion: ''
  },
  onChange(e) {
    this.setData({
      suggestion: (e.detail.value || '').trim()
    });
  },
  async onSubmit() {
    console.log(this.data.suggestion);
    if (!this.data.suggestion) {
      this.showMessage('error', '请输入反馈意见');
      return;
    }
    await wait(300);
    this.setData({
      suggestion: ''
    });
    this.showMessage('success', '提交成功，感谢您的反馈');
  },
  showMessage(type, content) {
    Message[type]({
      context: this,
      offset: [90, 32],
      duration: 3000,
      content: content
    });
  }
});
