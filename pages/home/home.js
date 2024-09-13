import { api, get, post } from '../../utils/util';

import { fetchHome } from '../../services/home/home';
import { fetchGoodsList } from '../../services/good/fetchGoods';
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    startY: '',
    endY: '',
    current: 0,
    autoplay: true,
    duration: 200,
    interval: 1000,
    showModal: false,
    newImages: ['/assets/t1.png', '/assets/t2.png', '/assets/banner1.png', '/assets/banner2.png', '/assets/banner3.png'],
    imgSrcs: [],
    swiper: [],
    tabList: [],
    goodsList: [],
    goodsListLoadStatus: 0,
    pageLoading: false,
    // current: 1,
    autoplay: true,
    duration: '500',
    interval: 5000,
    navigation: {
      type: 'dots'
    },
    swiperImageProps: {
      mode: 'scaleToFill'
    },

    // Code by Joenix
    content: [
      // htps://mp.weixin.qq.com/s/<link>
      {
        cover: 'https://oss.lhdd.club/banner_1.webp',
        title: '六合竹简点读体系之简单介绍',
        description: '习近平总书记指出：“文化自信是一个国家、一个民族发展中最基本、最深沉、最持久的力量。”没有高度的文化自信，没有文化的繁荣兴盛，就没有中华民族的伟大复兴。同时，习近平总书记指出：“我们现在是距离中华民族文化复兴最近的一个时代。我们自信起来了。',
        link: 'h2ITrbWI2zgqsZiWYdwGvw'
      },
      {
        cover: 'https://oss.lhdd.club/banner_2.webp',
        title: '六合竹简点读法原理及相关问题的解答',
        description: '“六合竹简点读法”是以单手或双手（包括但不限于手指的指尖、指腹及指关节）在特制的竹简上边做特殊“手指操”边学习的过程。',
        link: '-1wZAttfwxLeY8JUYEy6xw'
      },
      {
        cover: 'https://oss.lhdd.club/banner_3.webp',
        title: '六合简工考',
        description: '六合大道，无穷玄妙，无相为体，万法归一。神意天授，先贤真传，无量法施，以简入道。<br />六合简工，仇师亲命，极深研几，九转功成。六合制简，上合天时，下明地理，中省人文。',
        link: 'ACWu6C2lkP3QC46IvNmGfw'
      }
    ]
  },

  goodListPagination: {
    index: 0,
    num: 4
  },

  privateData: {
    tabIndex: 0
  },

  onShow() {
    this.getTabBar().init();
  },

  onLoad() {
    wx.getImageInfo({
      src: '/assets/banner1.png',
      success(res) {
        console.log(res);
      }
    });

    this.init();
  },

  onReachBottom() {},

  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.loadHomePage();
  },

  /**
   * Tabs
   * ====== ====== ======
   */
  async onTabsChange(e) {
    const { value: id } = e.detail;

    if (!id) {
      return;
    }

    this.setData({
      content: []
    });

    const { data: content } = await post(api.Information.getall, { filters: [{ key: 'type', value: id }] });

    this.setData({
      content
    });
  },

  loadHomePage() {
    wx.stopPullDownRefresh();

    this.setData({
      pageLoading: true
    });

    fetchHome().then(({ swiper, tabList }) => {
      this.setData({
        tabList,
        imgSrcs: swiper.slice(0),
        swiper,
        pageLoading: false
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
        scrollTop: 0
      });
    }

    this.setData({
      goodsListLoadStatus: 1
    });

    const pageSize = this.goodListPagination?.num;
    let pageIndex = this.privateData.tabIndex * pageSize + this.goodListPagination.index + 1;
    if (fresh) {
      pageIndex = 0;
    }

    try {
      const nextList = await fetchGoodsList(pageIndex, pageSize);
      this.setData({
        goodsList: fresh ? nextList : this.data.goodsList.concat(nextList),
        goodsListLoadStatus: 0
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
      url: '/pages/book/detail/detail'
    });
  },

  goodListAddCartHandle() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '点击加入购物车'
    });
  },

  navToSearchPage() {
    wx.navigateTo({
      url: '/pages/goods/search/index'
    });
  },

  navToActivityDetail({ detail }) {
    const { index: promotionID = 0 } = detail || {};
    wx.navigateTo({
      url: `/pages/promotion-detail/index?promotion_id=${promotionID}`
    });
  },

  // 跳转咨询页面
  jump2information(e) {
    const {
      currentTarget: {
        dataset: { id }
      }
    } = e;

    console.log('id', id);

    if (id) {
      // 跳转到咨询详情页面
      wx.navigateTo({
        url: `/pages/information/detail/detail?id=${id}`
      });
    }

    // 跳转到咨询首页
    wx.navigateTo({
      url: '/pages/information/list/list'
    });
  },
  // 金刚位跳转
  jump2jingang(e) {
    const {
      currentTarget: {
        dataset: { type }
      }
    } = e;

    switch (type) {
      case '1':
        // 学习咨询
        wx.navigateTo({
          url: '/pages/information/list/list'
        });
        break;
      case '2':
        // 六合简书
        wx.navigateTo({
          url: '/pages/home/sixbook/sixbook'
        });
        break;
      case '3':
        // 直播预告
        wx.navigateTo({
          url: '/pages/home/notice/notice'
        });
        break;
      case '4':
        // 学习商城
        wx.navigateTo({
          url: `/pages/webview/webview?url=${encodeURIComponent('http ://www.baidu.com')}`
        });
        break;
    }
  },

  // 签到
  sign() {
    wx.navigateTo({
      url: '/pages/sign/sign'
    });
  },

  // 关注
  follow() {
    this.setData({
      showModal: true
    });
  },

  closeModal() {
    this.setData({
      showModal: false
    });
  },

  // 轮播滚动
  handleSwiperChange(e) {
    // 获取当前轮播图的索引
    const current = e.detail.current;
    this.setData({
      current: current,
      startY: 0,
      endY: 0,
      imgSrcs: this.data.swiper.slice(0)
    });
  },
  handleTouchStart(e) {
    this.setData({
      startY: e.touches[0].pageY
    });
  },

  handleTouchMove(e) {
    this.setData({
      endY: e.touches[0].pageY
    });
  },

  handleTouchEnd(e) {
    const { startY, endY, current, newImages } = this.data;

    const slideDistance = startY - endY;

    // 判断是否为上滑
    if (slideDistance > 50) {
      const newSrc = newImages[current];
      this.setData({
        [`imgSrcs[${current}]`]: newSrc
      });
    }
  }
});
