import { api, post, wait } from '../../../../../utils/util';

Page({
  data: {
    address: '上海市虹口区海伦路海伦大厦101海伦路海伦大厦101',
    phone: '16662636362',
    name: '苏苏',
    selectedGift: null
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('dataFromOpenerPage', (data) => {
      console.log(data)
      this.setData(data)
    })
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
  confirmAddress: async function () {
    console.log(this.data);
    await post(api.User.addAddress, {
      address: this.data.address,
      phone: this.data.phone,
      name: this.data.name
    });
    Message.error({
      context: this,
      offset: [90, 32],
      duration: 3000,
      content: "兑换申请已提交"
    });
    await wait(3000)
    wx.navigateBack();
  }
});
