import { api, post, wait } from '../../../../../utils/util';

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
    const userInfo = wx.getStorageSync('userInfo');
    const selectedGift = this.data.selectedGift;
    await post(api.Creditshop.confirmAddress, {
      userid: userInfo.id,
      credit: selectedGift.credits,
      creditshopid: selectedGift.id,
      content: [this.data.name, this.data.phone, this.data.address].join(',')
    });
    Message.error({
      context: this,
      offset: [90, 32],
      duration: 3000,
      content: '兑换申请已提交'
    });
    await wait(3000);
    wx.navigateBack();
  }
});
