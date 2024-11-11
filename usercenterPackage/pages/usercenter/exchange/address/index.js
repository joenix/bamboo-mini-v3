import { api, post, wait } from '../../../../../utils/util';
import Message from 'tdesign-miniprogram/message/index';

Page({
  data: {
    address: '',
    phone: '',
    name: '',
    selectedGift: null
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('dataFromOpenerPage', (data) => {
      this.setData(data);
    });
  },
  onUnload() {
    this.setData({
      address: '',
      phone: '',
      name: '',
      selectedGift: null
    });
  },
  // 输入框输入时
  onInput(e) {
    const { value } = e.detail;
    const { name } = e.currentTarget.dataset;
    this.setData({
      ...this.data,
      [name]: value
    });
  },
  confirmAddress: async function () {
    if(this.loading) {
      return;
    }
    this.loading = true;
    try {
      const userInfo = wx.getStorageSync('userInfo');
      const selectedGift = this.data.selectedGift;
      await post(api.Creditshop.confirmAddress, {
        userid: userInfo.id,
        credit: selectedGift.credits,
        creditshopid: selectedGift.id,
        content: [this.data.name, this.data.phone, this.data.address].join(',')
      });
      this.showMessage('success', '兑换申请已提交')
      await wait(3000);
      wx.navigateBack();
    } catch (error) {
      this.showMessage('error', error.message)
    } finally {
      this.loading = false;
    }
  },
  showMessage(type, content) {
    Message[type]({
      context: this,
      offset: [90, 32],
      duration: 3000,
      content
    });
  }
});
