// homePackage/pages/home/jiangzuo/index.js
import { api, post, link2 } from '../../../../utils/util';

Page({
  data: {
    list:[]
  },
  onLoad(options) {
    this.init();
  },
  onPullDownRefresh() {
    this.init();
  },
  async init(id = "6") {
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
    const list = this.data.list;
    this.setData({
      list: list.concat(newContent)
    });
  },
  link_detail(e) {
    const { id } = e.currentTarget.dataset;

    link2('/homePackage/pages/home/jiangzuo/detail/index', {
      id
    });
  },
})