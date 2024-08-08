import {
  fetchHome
} from '../../services/home/home';
import {
  fetchGoodsList
} from '../../services/good/fetchGoods';
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    showModal: false,
    imgSrcs: [],
    tabList: [],
    goodsList: [],
    goodsListLoadStatus: 0,
    pageLoading: false,
    current: 1,
    autoplay: true,
    duration: '500',
    interval: 5000,
    navigation: {
      type: 'dots'
    },
    swiperImageProps: {
      mode: 'scaleToFill'
    },
  },

  goodListPagination: {
    index: 0,
    num: 4,
  },

  privateData: {
    tabIndex: 0,
  },

  onShow() {
    this.getTabBar().init();
  },

  onLoad() {
    this.init();
  },

  onReachBottom() {

  },

  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.loadHomePage();
  },

  loadHomePage() {
    wx.stopPullDownRefresh();

    this.setData({
      pageLoading: true,
    });
    fetchHome().then(({
      swiper,
      tabList
    }) => {
      this.setData({
        tabList,
        imgSrcs: swiper,
        pageLoading: false,
      });
      this.loadGoodsList(true);
    });
  },

  tabChangeHandle(e) {
    this.privateData.tabIndex = e.detail;
    this.loadGoodsList(true);
  },

  onReTry() {
    this.loadGoodsList();
  },

  async loadGoodsList(fresh = false) {
    if (fresh) {
      wx.pageScrollTo({
        scrollTop: 0,
      });
    }

    this.setData({
      goodsListLoadStatus: 1
    });

    const pageSize = this.goodListPagination.num;
    let pageIndex = this.privateData.tabIndex * pageSize + this.goodListPagination.index + 1;
    if (fresh) {
      pageIndex = 0;
    }

    try {
      const nextList = await fetchGoodsList(pageIndex, pageSize);
      this.setData({
        goodsList: fresh ? nextList : this.data.goodsList.concat(nextList),
        goodsListLoadStatus: 0,
      });

      this.goodListPagination.index = pageIndex;
      this.goodListPagination.num = pageSize;
    } catch (err) {
      this.setData({
        goodsListLoadStatus: 3
      });
    }
  },

  goodListClickHandle(e) {
    wx.navigateTo({
      url: "/pages/book/detail/detail",
    })
  },

  goodListAddCartHandle() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '点击加入购物车',
    });
  },

  navToSearchPage() {
    wx.navigateTo({
      url: '/pages/goods/search/index'
    });
  },

  navToActivityDetail({
    detail
  }) {
    const {
      index: promotionID = 0
    } = detail || {};
    wx.navigateTo({
      url: `/pages/promotion-detail/index?promotion_id=${promotionID}`,
    });
  },

  // 跳转咨询页面
  jump2information(e) {
    const {
      currentTarget: {
        dataset: {
          id
        }
      }
    } = e

    console.log('id', id)

    if (id) {
      // 跳转到咨询详情页面
      wx.navigateTo({
        url: `/pages/information/detail/detail?id=${id}`,
      })
    }

    // 跳转到咨询首页
    wx.navigateTo({
      url: "/pages/information/list/list",
    })
  },
  // 金刚位跳转
  jump2jingang(e) {
    const {
      currentTarget: {
        dataset: {
          type
        }
      }
    } = e

    switch (type) {
      case '1':
        // 学习咨询
        wx.navigateTo({
          url: "/pages/information/list/list",
        })
        break
      case '2':
        // 六合简书
        wx.navigateTo({
          url: "/pages/home/sixbook/sixbook",
        })
        break
      case '3':
        // 直播预告   
        wx.navigateTo({
          url: "/pages/home/notice/notice",
        })
        break
      case '4':
        // 学习商城
        wx.navigateTo({
          url: `/pages/webview/webview?url=${encodeURIComponent('http ://www.baidu.com')}`
        });
        break
    }
  },

  // 签到
  sign() {
    wx.navigateTo({
      url: "/pages/sign/sign"
    })
  },

  // 关注
  follow() {
    this.setData({
      showModal: true
    })
  },

  closeModal() {
    this.setData({
      showModal: false
    })
  },
});