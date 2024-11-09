import { checkToken, api, get, post, link2 } from '../../utils/util';

import { fetchHome } from '../../services/home/home';
import { fetchGoodsList } from '../../services/good/fetchGoods';
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    currentTabId: '0',
    startY: '',
    endY: '',
    autoplay: true,
    duration: 200,
    interval: 1000,
    showModal: false,
    newImages: [],
    imgSrcs: [],
    swiper: [],
    tabList: [],
    goodsList: [],
    goodsListLoadStatus: 0,
    pageLoading: false,
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
    content: {
      0: [],
      1: [],
      2: [],
      3: []
    },
    course: []
  },

  // 从 Blocker 同步数据
  syncIndex(e) {
    // 解构数据
    const { name, index, item } = e.detail;

    // 更新数据
    this.setData({
      [`${name}[${index}]`]: {
        ...item
      }
    });

    // return false;
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
    const id = this.data.currentTabId;
    this.init(id);
  },

  onLoad() {
    wx.getImageInfo({
      src: '/assets/banner1.png',
      success(res) {
        console.log(res);
      }
    });
  },

  onReachBottom() {},

  onPullDownRefresh() {
    const id = this.data.currentTabId;
    this.init(id);
  },

  async init(id) {
    if (!id) {
      return;
    }
    let { data } = await post(api.Information.getall, {
      filters: [
        {
          key: 'type',
          value: id
        }
      ]
    });
    const newContent = data.map((item) => {
      if (/\,/.test(item.name)) {
        item.name = item.name.split(',');
      }
      if (/\,/.test(item.content)) {
        item.content = item.content.split(',');
      }
      return item;
    });
    const nowData = this.data.content;
    this.setData({
      content: {
        ...nowData,
        [id]: (nowData[id] || []).concat(newContent)
      }
    });
  },

  /**
   * Tabs
   * ====== ====== ======
   */
  onTabsChange(e) {
    const id = e.detail.value;
    this.setData({
      currentTabId: id
    });
    this.init(id);
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
      url: '/bookPackage/pages/book/detail/detail'
    });
  },

  goodListAddCartHandle() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '点击加入购物车'
    });
  },
  // 最新资讯 链接跳转
  link_article(e) {
    const { id } = e.currentTarget.dataset;

    link2('/homePackage/pages/article/article', {
      id
    });
  },

  link_team(e) {
    const { id } = e.currentTarget.dataset;

    link2('/homePackage/pages/home/team/team', {
      id
    });
  },

  link_org(e) {
    const { id } = e.currentTarget.dataset;

    link2('/homePackage/pages/home/org/org', {
      id
    });
  },

  link_lesson(e) {
    const { id } = e.currentTarget.dataset;

    link2('/homePackage/pages/home/lesson/lesson', {
      id
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
        url: `/informationPackage/pages/information/detail/detail?id=${id}`
      });
    }

    // 跳转到咨询首页
    wx.navigateTo({
      url: '/informationPackage/pages/information/list/list'
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
          url: '/informationPackage/pages/information/list/list'
        });
        break;
      case '2':
        // 六合简书
        wx.navigateTo({
          url: '/informationPackage/pages/home/sixbook/sixbook'
        });
        break;
      case '3':
        // 直播预告
        wx.navigateTo({
          url: '/informationPackage/pages/home/notice/notice'
        });
        break;
      case '4':
        // 学习商城
        wx.navigateTo({
          url: `/homePackage/pages/webview/webview?url=${encodeURIComponent('http ://www.baidu.com')}`
        });
        break;
    }
  },

  // 签到
  sign() {
    wx.navigateTo({
      url: '/usercenterPackage/pages/sign/sign'
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
  },
  jump2Child(e) {
    const type = e.currentTarget.dataset.type;
    const url = `/homePackage/pages/home/${type}/index`;
    link2(url)
  }
});
