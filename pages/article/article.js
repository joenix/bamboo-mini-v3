import { api, get, post, formatTime } from '../../utils/util';

// article.js
Page({
  data: {
    id: null,
    article: {}
  },

  onLoad({ id }) {
    // 判断参数是否存在，并设置 URL
    if (id) {
      this.setData({ id });
      this.getData({ id });
    }
  },

  async getData({ id }) {
    const { name: title, content, updatedAt: datetime } = await post(api.Information.detail, { id });
    const article = { title, datetime: formatTime(datetime, 'YYYY年MM月DD日 HH:MM'), content };

    this.setData({ article });
  }
});
