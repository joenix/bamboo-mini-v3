// pages/usercenter/suggest/suggest.js
import {api, post} from '../../../../utils/util'

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
    addressModal: false,
    succsssModal: false,
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
    this.setData({
      confirmModal: true,
      selectedGift: this.data.gifts[index]
    });
  },
  confirmExchange: async function () {
    // await post(api.User.selectedGift, {
    //   id: this.data.selectedGift.id
    // })
    this.setData({
      confirmModal: false,
      addressModal: true
    });
  },
  cancelExchange: function () {
    this.setData({
      confirmModal: false
    });
  },
  confirmAddress: function () {
    wx.navigateTo({
      url: '/usercenterPackage/pages/usercenter/exchange/address/index',
      events: {
        addressOk: () => {
          this.setData({
            addressModal: false,
            succsssModal: true
          });
        }
      }
    });
  },
  confirmOk() {
    this.setData({
      succsssModal: false
    })
  }
});
