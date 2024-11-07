// pages/usercenter/suggest/suggest.js
import { Toast } from 'tdesign-miniprogram';
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
    const value = e.detail.value;
    this.setData({
      suggestion: value
    });
  },
  async onSubmit() {
    console.log(this.data.suggestion);
    wait(300);
    this.setData({
      suggestion: ''
    });
    Toast({
      context: this,
      selector: '#t-toast',
      message: '提交成功'
    });
  }
});
