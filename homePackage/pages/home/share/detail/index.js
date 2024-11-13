// homePackage/pages/home/gongfu/detail/index.js
import { api, post, formatTime } from '../../../../../utils/util';

Page({
  data: {
    id: null,
    data: {}
  },

  onLoad({ id }) {
    // 判断参数是否存在，并设置 URL
    if (id) {
      this.setData({ id });
      this.getData({ id });
    }
  },

  async getData({ id }) {
    const { name: title, img, content, remark, updatedAt: datetime } = await post(api.Information.detail, { id });

    const _remark = remark
      // Image
      .replace(/<img/gi, '<img style="max-width: 100%; margin: .75rem 0 .25rem;"')
      // Part
      .replace(/<p/gi, '<p style="text-align: justify; margin: .75rem 0 .25rem; color: #363636;');

    const data = {
      title,
      img,
      datetime: formatTime(datetime, 'YYYY年MM月DD日 HH:MM'),
      content,
      remark: _remark
    };

    this.setData({ data });
  }
});
