import { api, get, post, formatTime } from '../../../utils/util';

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

    article.content = article.content
      // Image
      .replace(/<img/gi, '<img style="max-width: 100%; margin: .75rem 0 .25rem;"')
      // Part
      .replace(/<p/gi, '<p style="text-align: justify; margin: .75rem 0 .25rem; color: #363636;"');

    this.setData({ article });
  }
});
