import Message from 'tdesign-miniprogram/message';
import {
  api,
  post,
} from '../../../../utils/util';

Page({
  data: {
    bookId: '',
    pageTitle: '开始点读',
    step: 1,
    countdown: 0,
    countdown_ui: {
      hh: '00',
      mm: '00',
      ss: '00'
    },
    countdown_interval: null,
    bgm: null,
    isBgmStop: false,
    bgmInfo: {},
    bgmPopup: false,
    bgmList: [],
    settingPopup: false,
    settingData: {
      remind: "0",
      guide: "0",
      hour: '',
      minute: '',
    },
    remindCountDown: 0,
    remindAudioContext: null,
    resultPopup: false,
    resultTimes: '',
    resultFeedback: ''
  },
  settingChange(e) {
    const key = e.currentTarget.dataset.type
    const value = e.detail.value;
    this.setData({
      settingData: {
        ...this.data.settingData,
        [key]: value
      }
    })
  },
  settingPopupOpen() {
    this.setData({
      settingPopup: true
    });
  },
  onSettingPopupOpen(e) {
    this.setData({
      settingPopup: e.detail.visible
    });
  },
  bgmPopupOpen(e) {
    this.setData({
      bgmPopup: true
    });
  },
  onbgmPopupCancel() {
    this.setData({
      bgmPopup: false
    })
  },
  bgmConfirm(e) {
    const {
      value,
      label
    } = e.detail;
    const bgmInfo = {
      value: value[0],
      label: label[0]
    }
    this.setData({
      bgmInfo,
      bgmPopup: false
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
      resultTimes: '',
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
    if (this.data.bgm) {
      this.data.bgm.stop();
    }
    if (this.data.remindAudioContext) {
      this.data.remindAudioContext.destroy();
    }
    this.setData({
      remindCountDown: 0,
      remindAudioContext: null
    })
    clearInterval(this.data.countdown_interval);
  },
  startBgm() {
    const {
      bgm,
      bgmList,
      bgmInfo
    } = this.data;
    if (!bgmInfo.value || bgmList.length <= 2) {
      return;
    }
    let index = 2;
    let src = '';
    let title = '';

    if (bgmInfo.value === 'loop') {
      src = bgmList[index].value
      title = bgmList[index].label
    } else {
      src = bgmInfo.value;
      title = bgmInfo.label;
    }
    bgm.src = src;
    bgm.title = title;
    bgm.onEnded(() => {
      if (bgmInfo.value !== 'loop') {
        bgm.src = src;
        return;
      }
      index = index === bgmList.length - 1 ? 2 : index + 1
      bgm.src = bgmList[index].value
      bgm.title = bgmList[index].label
    })
  },
  toggleStop() {
    const stop = !this.data.isBgmStop
    if (stop) {
      this.data.bgm.pause()
    } else {
      this.data.bgm.play()
    }
    this.setData({
      isBgmStop: stop
    })
  },
  // 内部跳转
  updateStep(e) {
    const {
      go: step,
      inner,
    } = e.currentTarget.dataset;
    // 提交点读
    if (step === 1) {
      this.setData({
        pageTitle: "开始点读"
      })
    }
    // 开始点读
    if (step === 2) {
      this.setData({
        pageTitle: "计时",
        isBgmStop: false,
        settingPopup: false
      })
      const {
        remind,
        hour,
        minute
      } = this.data.settingData
      this.startBgm();
      this.startCountdown();
      if (inner && remind === '1') {
        this.handleRemind(hour, minute)
      }
    }
    // 结束点读
    if (step === 3) {
      this.setData({
        resultPopup: true,
        pageTitle: "计时"
      })
      this.endCountdown();
    }
    this.setData({
      step
    });
  },
  showMessage(type, content) {
    Message[type]({
      context: this,
      offset: [90, 32],
      duration: 3200,
      content
    })
  },
  async doSubmit() {
    if ((this.data.resultTimes || 0) < 1) {
      this.showMessage('error', '请检查点读遍数')
      return;
    }
    const userInfo = wx.getStorageSync('userInfo');
    const {
      countdown,
      resultTimes,
      resultFeedback,
      bookId
    } = this.data;
    await post(api.Read.submit + '?credit=10', {
      time: countdown,
      count: +resultTimes,
      content: resultFeedback,
      bookId: +bookId,
      userId: userInfo.id
    })
    this.showMessage('success', '点读记录提交成功')
    this.resetCountdown();
    this.setData({
      step: 1
    });
  },
  handleRemind(hour, minute) {
    if (!hour && !minute) {
      return;
    }
    const time = (hour || 0) * 3600 + (minute || 0) * 60;
    this.setData({
      remindCountDown: time * 1000
    })
  },
  remindFinish() {
    console.log(323);
    let count = 0;
    const audioContext = wx.createInnerAudioContext({
      useWebAudioImplement: false
    })
    this.setData({
      remindAudioContext: audioContext
    })
    audioContext.src = 'https://oss.lhdd.club/music/ring.mp3'
    audioContext.onEnded(() => {
      count += 1
      if (count === 3) {
        audioContext.destroy();
        this.setData({
          remindAudioContext: null
        });
      } else {
        audioContext.seek(0);
        audioContext.play();
      }
    })
    audioContext.play();
  },
  onResultTimesChange(e) {
    const {
      value: resultTimes
    } = e.detail;

    this.setData({
      resultTimes
    });
  },
  onResultFeedbackChange(e) {
    const {
      value: resultFeedback
    } = e.detail;

    this.setData({
      resultFeedback
    });
  },
  onReady() {
    const bgm = wx.getBackgroundAudioManager();
    this.setData({
      bgm
    })
  },
  onLoad(options) {
    const defalutList = [{
        value: null,
        label: '无',
      },
      {
        value: 'loop',
        label: '列表默认循环',
      }
    ]
    const newBgmList = [{
        value: 'https://oss.lhdd.club/music/read_bgm_1.mp3',
        label: '古筝 - 古风温馨春华秋实',
      },
      {
        value: 'https://oss.lhdd.club/music/read_bgm_2.mp3',
        label: '古筝 - 中国风 余音绕梁',
      }
    ];
    this.setData({
      bgmInfo: newBgmList[0],
      bgmList: defalutList.concat(newBgmList),
      bookId: options.bookId
    });
    this.resetCountdown();
  },
  onUnload() {
    this.endCountdown();
  }
});