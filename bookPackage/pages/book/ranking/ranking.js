import { api, post } from '../../../../utils/util';

// pages/book/ranking/ranking.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 'today',
    myUserId: '',
    myRankInfo: {},
    listData: [],
    top3ListData: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function () {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      myUserId: userInfo.id,
      currentTab: 'today'
    });
    this.getRankList('today');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab
    });
    this.getRankList(tab);
  },
  async getRankList(listType) {
    const isTodayList = listType === 'today';
    const url = isTodayList ? api.Rank.getTodayList : api.Rank.getHistoryList;
    const rankList = await post(url);
    let myRankInfo = {};
    const list = rankList.data.map((v, index) => {
      const data = {
        rank: index + 1,
        userId: v.userId,
        time: (v._sum.time / 3600 / 1000).toFixed(2),
        avatarUrl: v.user.avatarUrl,
        nickname: v.user.nickname
      };
      if (v.userId === this.data.myUserId) {
        myRankInfo = data;
      }
      return data;
    });
    const listData = list.length > 3 ? list.slice(3) : list;
    const top3ListData = list.length > 3 ? list.slice(0, 3) : [];
    this.setData({
      listData,
      top3ListData,
      myRankInfo: isTodayList ? myRankInfo : null
    });
  },
  linkBack() {
    wx.navigateBack();
  }
});
