import { api, post, formatTime } from '../../../utils/util';

Component({
  data: {
    indexs: [],
    selectIdx: 0,
    viewId: '',
    tips: [
      {
        index: '今日贴士',
        id: 'today',
        children: []
      },
      {
        index: '本周贴士',
        id: 'week',
        children: []
      },
      {
        index: '本月贴士',
        id: 'month',
        children: []
      }
    ],
    opens: [0],
    page: 1,
    loadEnd: false
  },

  // onLoad() {
  //   const tips = this.data.tips;
  //   this.setData({
  //     indexs: tips.map((item) => item.index),
  //     viewId: tips[0].id
  //   });
  //   this.getTips();
  // },
  // onShow() {
  //   this.getTabBar().init();
  // },
  // onSelect(e) {
  //   const index = e.currentTarget.dataset.index;
  //   this.setData({
  //     selectIdx: index,
  //     viewId: this.data.tips[index].id
  //   });
  // },
  // onControl(event) {
  //   const { index } = event.currentTarget.dataset;
  //   const value = this.data.opens[index] || false;

  //   this.data.opens[index] = !value;

  //   this.setData({
  //     opens: this.data.opens
  //   });
  // },
  // onPullDownRefresh() {
  //   this.getTips();
  // },
  // onReachBottom() {
  //   this.getTips(this.data.page);
  // },

  methods: {
    onControl(event) {
      const { index } = event.currentTarget.dataset;
      const value = this.data.opens[index] || false;

      this.data.opens[index] = !value;

      this.setData({
        opens: this.data.opens
      });
    },
    jump2Detail(e) {
      const info = e.currentTarget.dataset.info;
      wx.navigateTo({
        url: `/homePackage/pages/tips-detail/detail`,
        success: function (res) {
          res.eventChannel.emit('setDetailContent', { data: info });
        }
      });
    },
    async getTips(page = 1) {
      if (this.data.loadEnd) return;
      let tips = this.data.tips;

      if (page === 1) {
        // 重置
        tips = tips.map((v) => ({ ...v, children: [] }));
        this.setData({
          tips,
          page: 1,
          loadEnd: false
        });
      }

      const { data, totalPages, currentPage } = await post(api.Tips.getall + '?pageSize=50&page=' + page);

      const now = new Date().getTime();
      const day = now + 1000 * 60 * 60 * 24;

      data.forEach((item, index) => {
        const time = new Date(item.updatedAt).getTime();
        item.updatedAt = formatTime(item.updatedAt, 'YYYY年MM月DD日');

        if (time <= day * 1) {
          tips[0].children.push(item);
        }

        if (time > day * 1 && time <= day * 7) {
          tips[1].children.push(item);
        }

        if (time > day * 7 && time <= day * 30) {
          tips[2].children.push(item);
        }

        // 补丁
        this.data.opens[index] = false;
      });

      console.log(tips);

      this.setData({
        tips,
        page: currentPage + 1,
        loadEnd: currentPage >= totalPages
      });
    },
    getMoreTips() {
      this.getTips(this.data.page);
    }
  }
});
