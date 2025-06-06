import { api, get, post, formatTime } from '../../../../utils/util';
import { boss } from '../../../../utils/const';

// teacher.js
Page({
  data: {
    id: null,
    teacher: {}
  },

  onLoad({ id }) {
    // 判断参数是否存在，并设置 URL
    if (id) {
      this.setData({ id });
      this.getData({ id });
    }
  },

  async getData({ id }) {
    if (+id == 100) {
      this.setData({ teacher: boss });
      return;
    }

    const { name: title, content, img, remark, updatedAt: datetime } = await post(api.Information.detail, { id });
    const teacher = { title, datetime: formatTime(datetime, 'YYYY年MM月DD日 HH:MM'), content, remark };

    teacher.content = teacher.content.split(',');
    teacher.img = img;
    teacher.remark = teacher.remark
      // Image
      .replace(/<img/gi, '<img style="max-width: 100%; margin: .75rem 0 .25rem;"')
      // Part
      .replace(/<p/gi, '<p style="text-align: justify; margin: .75rem 0 .25rem; color: #363636;');

    this.setData({ teacher });
  }
});
