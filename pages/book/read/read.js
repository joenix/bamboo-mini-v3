import dayjs from 'dayjs';
import { lunar, api, post, link2, utcFormatTime } from '../../../utils/util';
import Message from 'tdesign-miniprogram/message/index';

Page({
  data: {
    screen: 0,
    step: 1,
    countdown: 0,
    countdown_ui: {
      hh: '00',
      mm: '00',
      ss: '00'
    },
    countdown_interval: null,
    bgm: null,
    bgmInfo: {},
    bgmCurrent: 0,
    bgmPopup: false,
    bgmList: [
      {
        src: 'https://oss.lhdd.club/music/read_bgm_1.mp3',
        title: '古筝 - 古风温馨春华秋实',
        singer: '仇氏点读',
        coverImgUrl: null
      },
      {
        src: 'https://oss.lhdd.club/music/read_bgm_2.mp3',
        title: '古筝 - 中国风 余音绕梁',
        singer: '仇氏点读',
        coverImgUrl: null
      }
    ],

    resultTimes: 0,
    resultFeedback: ''
  },

  bgmPopupOpen(e) {
    const { index } = e.currentTarget.dataset;

    this.setData({
      bgmCurrent: index,
      bgmPopup: true
    });
  },

  onBgmPopupOpen(e) {
    this.setData({
      bgmPopup: e.detail.visible
    });
  },

  setBgm({ title, singer = '仇氏点读', src } = {}) {
    this.data.bgm.src = src;
    this.data.bgm.title = title;
    this.data.bgm.singer = singer;

    this.data.bgm.onCanplay(() => this.data.bgm.pause());

    setTimeout(() => {
      this.data.bgm.pause();
    }, 500);

    this.setData({
      bgm: this.data.bgm
    });
  },

  setCountdown() {},

  bgmChange(e) {
    const { index } = e.currentTarget.dataset;
    const bgmInfo = this.data.bgmList[index];

    this.setData({
      bgmCurrent: index,
      bgmInfo,
      bgmPopup: false
    });

    this.setBgm(bgmInfo);
  },

  bgmChoose(e) {
    const { index } = e.currentTarget.dataset;

    this.setData({
      bgmCurrent: index
    });
  },

  resetCountdown() {
    this.setData({
      countdown: 0,
      countdown_ui: {
        hh: '00',
        mm: '00',
        ss: '00'
      },
      resultTimes: 0,
      resultFeedback: ''
    });
  },

  startCountdown() {
    const that = this;

    // Pause: 500ms, Play: 600ms
    const out = setTimeout(() => {
      that.data.bgm.play();
      clearTimeout(out);
    }, 600);

    const countdown_interval = setInterval(() => {
      const countdown = that.data.countdown + 1000;
      const countdate = new Date(countdown);

      const hh = countdate.getHours() - 8;
      const mm = countdate.getMinutes();
      const ss = countdate.getSeconds();

      const countdown_ui = {
        hh: String(hh).padStart(2, '0'),
        mm: String(mm).padStart(2, '0'),
        ss: String(ss).padStart(2, '0')
      };

      that.setData({
        countdown,
        countdown_ui
      });
    }, 1000);

    this.setData({
      countdown_interval
    });
  },

  endCountdown() {
    this.data.bgm.pause();
    clearInterval(this.data.countdown_interval);
  },

  // 内部跳转
  updateStep(e) {
    const { go: step } = e.currentTarget.dataset;

    // 提交点读
    if (step === 1) {
      if (this.data.resultTimes < 1) {
        return Message.error({
          context: this,
          offset: [90, 32],
          duration: 3200,
          content: '请检查点读遍数'
        });
      }

      Message.success({
        context: this,
        offset: [90, 32],
        duration: 3200,
        content: '点读记录提交成功'
      });
      this.resetCountdown();
    }

    // 开始点读
    if (step === 2) {
      this.bgmChange({ currentTarget: { dataset: { index: this.data.bgmCurrent } } });
      this.resetCountdown();
      this.startCountdown();
    }

    // 结束点读
    if (step === 3) {
      this.endCountdown();
    }

    this.setData({
      step
    });
  },

  onResultTimesChange(e) {
    const { value: resultTimes } = e.detail;

    this.setData({
      resultTimes
    });
  },

  onResultFeedbackChange(e) {
    const { value: resultFeedback } = e.detail;

    this.setData({
      resultFeedback
    });
  },

  onReady() {
    const bgm = wx.getBackgroundAudioManager();
    const bgmInfo = this.data.bgmList[this.data.bgmCurrent];

    this.setData({
      bgm,
      bgmInfo
    });
  },

  onLoad() {
    // 获取应用实例
    const app = getApp();

    // 设置 navBarHeight
    this.setData({
      screen: `calc(100vh - ${app.globalData.navBarHeight * 2 + 18}rpx)`
    });
  }
});
