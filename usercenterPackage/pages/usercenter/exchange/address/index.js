import { api, post } from '../../../../../utils/util';

Page({
  data: {
    address: '上海市虹口区海伦路海伦大厦101海伦路海伦大厦101',
    phone: '16662636362',
    name: '苏苏',
    noAddress: true,
    customBackClick: false
  },
  onLoad() {
    this.eventChannel = this.getOpenerEventChannel();
    this.setData({
      customBackClick: false
    });
    this.getAddress();
  },
  // 输入框输入时
  onInput(e) {
    const { value } = e.detail;
    const { name } = e.currentTarget.dataset;
    this.setData({
      info: {
        ...this.data.info,
        [name]: value
      }
    });
  },
  async getAddress() {
    await post(api.User.getAddress, {});
    this.setData({
      noAddress: true
    })
  },
  confirmAddress: async function () {
    console.log(this.data);
    await post(api.User.addAddress, {
      address: this.data.address,
      phone: this.data.phone,
      name: this.data.name
    });
    this.eventChannel.emit('addressOk');
    wx.navigateBack();
  },
  addNewAddress() {
    this.setData({
      noAddress: true,
      customBackClick: true,
      address: '',
      phone: '',
      name: '',
    });
  },
  onBackClick() {
    this.setData({
      noAddress: false,
      customBackClick: false
    })
  }
});
