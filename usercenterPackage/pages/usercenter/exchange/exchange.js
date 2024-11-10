// pages/usercenter/suggest/suggest.js
import {api, post} from '../../../../utils/util'
import Message from 'tdesign-miniprogram/message/index';

Page({
  data: {
    gifts: [
      {
        image: '礼品1图片链接',
        name: '礼品1',
        credits: 100
      },
      {
        image: '礼品2图片链接',
        name: '礼品2',
        credits: 200
      }
      // 添加更多礼品...
    ],
    confirmModal: false,
    selectedGift: null,
    totalCredits: 0
  },
  onLoad() {
    this.initGiftList()
  },
  async initGiftList() {
    const userInfo = wx.getStorageSync('userInfo')
    const data = await post(api.User.getGiftList, {
      userId: userInfo.id
    })
    this.setData({
      gifts: data,
      totalCredits: userInfo.credits.credit || 0
    })
  },
  exchangeGift: function (event) {
    var index = event.currentTarget.dataset.index;
    const gift = this.data.gifts[index];
    // if (gift.credits >= this.data.totalCredits) {
    //   Message.error({
    //     context: this,
    //     offset: [90, 32],
    //     duration: 3000,
    //     content: "您的学分不足"
    //   });
    //   return;
    // }
    this.setData({
      confirmModal: true,
      selectedGift: gift
    });
  },
  confirmExchange: async function () {
    // await post(api.User.selectedGift, {
    //   id: this.data.selectedGift.id
    // })
    this.setData({
      confirmModal: false,
    });
    wx.navigateTo({
      url: '/usercenterPackage/pages/usercenter/exchange/address/index',
      success: (res) => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('dataFromOpenerPage', { selectedGift: this.data.selectedGift })
      }
    });
  },
  cancelExchange: function () {
    this.setData({
      confirmModal: false
    });
  }
});
