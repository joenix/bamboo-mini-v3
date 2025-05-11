import { checkToken, api, get, post, link2 } from '../../utils/util';
import dayjs from 'dayjs';
import { match as pinyinMatch } from 'pinyin-pro';
import { fetchHome } from '../../services/home/home';
import { fetchGoodsList } from '../../services/good/fetchGoods';
import Toast from 'tdesign-miniprogram/toast/index';
import { boss } from '../../utils/const';

const today = dayjs().format('YYYY-MM-DD');

function debounce(fn, interval) {
  var timer;
  var gapTime = interval || 300; //间隔时间，如果interval不传，则默认1000ms
  return function (...args) {
    clearTimeout(timer);
    var context = this;
    timer = setTimeout(function () {
      fn.call(context, ...args);
    }, gapTime);
  };
}

function throttle(fn, interval) {
  var enterTime = 0; //触发的时间
  var gapTime = interval || 300;
  return function (...agrs) {
    var context = this;
    var backTime = Date.now();
    if (backTime - enterTime > gapTime) {
      fn.call(context, ...agrs);
      enterTime = backTime;
    }
  };
}

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
    tempContent: null,
    course: [],
    noticeContent: [],
    memberTypes: [
      { title: '六合竹简点读法创始人', subTitle: '', index: '创', data: [boss] },
      { title: '六合点读师', subTitle: '', index: '点', data: [] },
      { title: '六合导学师', subTitle: '', index: '导', data: [] },
      { title: '六合规划师', subTitle: '', index: '规', data: [] }
    ],
    indexList: [],
    currentIndex: 0,
    selectedIndex: -1,
    anchorArray: null,
    offsetTop: 150
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
    const baseContent = ['添加【六合融道】官方微信公众号，传播国学智慧'];
    const lastCheckedDate = wx.getStorageSync('lastCheckedDate');
    this.setData({
      noticeContent: today === lastCheckedDate ? baseContent : baseContent.concat('记得完成每日签到和每日任务哟')
    });
  },

  onLoad() {
    wx.getImageInfo({
      src: 'http://oss.lhdd.club/ui/banner1.png',
      success(res) {
        console.log(res);
      }
    });
    const id = this.data.currentTabId;
    this.init(id);
    this.setData({
      indexList: this.data.memberTypes.map((v) => v.index)
    });
  },

  onReachBottom() {
    const id = this.data.currentTabId;
    if (id !== 5) {
      return;
    }
    this.getMoreTips();
  },

  onPullDownRefresh() {
    this.setData({
      content: {
        [id]: []
      }
    });
    const id = this.data.currentTabId;
    this.init(id);
  },

  async init(id) {
    if (!id) {
      return;
    }
    if (id === '5') {
      this.getTips();
      return;
    }

    let link = api.Information.getall;

    console.log(160, id);

    switch (id) {
      case '1':
      // link = api.Information.teach_getall;
      case '2':
      // link = api.Information.school_getall;
    }

    console.log(169, link);

    let { data } = await post(link, {
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
    if (id === '1') {
      const memberTypes = this.data.memberTypes;
      memberTypes[2].data = newContent || [];
      this.setData({
        memberTypes
      });
      return;
    }
    this.setData({
      content: {
        ...nowData,
        [id]: (nowData[id] || []).concat(newContent)
      }
    });
  },
  // 贴士集数据
  getTips() {
    const fn = () => {
      const tipChild = this.selectComponent('#tip-list');
      console.log(tipChild);
      tipChild.getTips();
    };
    setTimeout(fn, 300);
  },
  getMoreTips() {
    const tipChild = this.selectComponent('#tip-list');
    tipChild?.getMoreTips();
  },
  /**
   * Tabs
   * ====== ====== ======
   */
  onTabsChange(e) {
    const id = e.detail.value;
    this.setData({
      currentTabId: id,
      content: {
        [id]: []
      }
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
    link2(url);
  },
  baseSearchChange(e, getFilterContent) {
    if (!this.data.tempContent) {
      this.setData({
        tempContent: this.data.content
      });
    }
    const searchContent = e.detail.value;
    if (searchContent.trim().length === 0) {
      this.setData({
        tempContent: null,
        content: this.data.tempContent
      });
      return;
    }
    const id = this.data.currentTabId;
    const allContent = this.data.tempContent || this.data.content;
    const filterContent = getFilterContent(allContent[id], searchContent);
    this.setData({
      content: {
        ...this.data.content,
        [id]: filterContent
      }
    });
  },
  onSearchChange(e) {
    this.baseSearchChange(e, (content, searchContent) =>
      content.filter((item) => {
        return Boolean(pinyinMatch(item.name[1], searchContent));
      })
    );
  },
  onSearchChange2(e) {
    this.baseSearchChange(e, (content, searchContent) =>
      content.filter((item) => {
        return Boolean(pinyinMatch(item.name, searchContent));
      })
    );
  },
  onIndexSelect(e) {
    const index = e.target.dataset.index;
    this.setData({
      currentIndex: index,
      selectedIndex: index
    });
    const id = `#member-${index}`;
    const query = wx.createSelectorQuery();
    query.select(id).boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) => {
      wx.pageScrollTo({
        scrollTop: res[0].top + res[1].scrollTop - this.data.offsetTop,
        duration: 300,
        success: () => {
          setTimeout(() => {
            this.setData({
              selectedIndex: -1
            });
          }, 350);
        }
      });
    });
  },
  onHandleScroll(e) {
    let anchorArray = this.data.anchorArray;
    if (!anchorArray) {
      const query = wx.createSelectorQuery();
      query
        .selectAll('.member-title')
        .boundingClientRect((react) => {
          anchorArray = react.map((v) => v.top);
          this.setData({
            anchorArray
          });
        })
        .exec();
    }
    const currentIndex = anchorArray?.reduce((acc, v, index) => {
      return v <= e.scrollTop + this.data.offsetTop ? index : acc;
    }, 0);
    if (currentIndex !== this.data.currentIndex) {
      this.setData({
        currentIndex: this.data.selectedIndex !== -1 ? this.data.selectedIndex : currentIndex
      });
    }
  },
  onPageScroll: throttle(function (e) {
    if (+this.data.currentTabId !== 1) return;
    if (this.data.selectedIndex >= 0) return;
    this.onHandleScroll(e);
  }, 100)
});
