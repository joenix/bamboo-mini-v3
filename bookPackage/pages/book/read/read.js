import Message from 'tdesign-miniprogram/message/index';
import { api, post } from '../../../../utils/util';
import { UpdateType, updateScoreAction } from '../../../../utils/score';

function formatSeconds(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');
  const secsStr = secs.toString().padStart(2, '0');
  console.log(hoursStr, minutesStr, secsStr);
  return `${hoursStr}:${minutesStr}:${secsStr}`;
}

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
      remind: '0',
      guide: '0',
      hour: '',
      minute: ''
    },
    remindCountDown: 0,
    remindAudioContext: null,
    resultPopup: false,
    resultTimes: '',
    readRecordInfo: {
      times: 0,
      time: 0
    },
    totalTimeUi: '',
    resultFeedback: '',
    isReading: false
  },
  settingChange(e) {
    const key = e.currentTarget.dataset.type;
    const value = e.detail.value;
    this.setData({
      settingData: {
        ...this.data.settingData,
        [key]: value
      }
    });
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
    });
  },
  bgmConfirm(e) {
    const { value, label } = e.detail;
    const bgmInfo = {
      value: value[0],
      label: label[0]
    };
    this.setData({
      bgmInfo,
      bgmPopup: false
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
  startBgm(guide) {
    const { bgm, bgmList, bgmInfo } = this.data;

    let index = 2;
    const getUserSettingBgm = () => {
      if (!bgmInfo.value) {
        return null;
      } else if (bgmInfo.value === 'loop') {
        const nextBgm = bgmList[index];
        index = index === bgmList.length - 1 ? 2 : index + 1;
        return nextBgm;
      } else {
        return bgmInfo;
      }
    };
    let currentBgm = null;
    if (guide === '1') {
      currentBgm = {
        value: 'https://oss.lhdd.club/music/guide.mp3',
        label: '引导音乐'
      };
    } else {
      currentBgm = getUserSettingBgm();
    }
    if (!currentBgm) return;
    bgm.src = currentBgm.value;
    bgm.title = currentBgm.label;
    bgm.onEnded(() => {
      currentBgm = getUserSettingBgm();
      if (!currentBgm) return;
      bgm.src = currentBgm.value;
      bgm.title = currentBgm.label;
    });
  },
  toggleStop() {
    const stop = !this.data.isBgmStop;
    if (stop) {
      this.data.bgm.pause();
    } else {
      this.data.bgm.play();
    }
    this.setData({
      isBgmStop: stop
    });
  },
  // 内部跳转
  updateStep(e) {
    const { go: step } = e.currentTarget.dataset;
    this.setData({
      step
    });
    // 提交点读
    if (step === 1) {
      this.setData({
        pageTitle: '开始点读'
      });
      return;
    }
    // 开始点读
    if (step === 2) {
      this.setData({
        pageTitle: '计时',
        isBgmStop: false,
        settingPopup: false,
        isReading: true
      });
      const { remind, hour, minute, guide } = this.data.settingData;
      this.startBgm(guide);
      this.startCountdown();
      if (remind === '1') {
        this.setRemindTime(hour, minute);
      }
      return;
    }
    // 结束点读
    this.stopBgm();
    const readInfo = wx.getStorageSync('readInfo') || { times: 0, time: 0 };
    const totalTime = readInfo.time + this.data.countdown / 1000;
    this.setData({
      resultPopup: true,
      pageTitle: '计时',
      readRecordInfo: {
        times: readInfo.times + 1,
        time: totalTime
      },
      totalTimeUi: formatSeconds(totalTime)
    });
  },
  showMessage(type, content) {
    Message[type]({
      context: this,
      offset: [90, 32],
      duration: 3200,
      content
    });
  },
  onResultVisible(e) {
    const visible = e.detail.visible;
    if (visible) return;
    this.resetData();
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
  async doSubmit() {
    // if ((this.data.resultTimes || 0) < 1) {
    //   this.showMessage('error', '请检查点读遍数');
    //   return;
    // }
    if (this.submiting) {
      return;
    }
    this.submiting = true;
    wx.showLoading({
      title: '提交中',
      mask: true
    });
    const userInfo = wx.getStorageSync('userInfo');
    const { countdown, resultFeedback, bookId, readRecordInfo } = this.data;
    try {
      await post(api.Read.submit + '?credit=10', {
        time: countdown,
        count: totalReadTimes,
        content: resultFeedback,
        bookId: +bookId,
        userId: userInfo.id
      });
      await updateScoreAction(UpdateType.Read);
      this.showMessage('success', '点读记录提交成功');
      wx.setStorageSync('readInfo', readRecordInfo);
      this.setData({
        step: 1,
        resultPopup: false
      });
      // TODO分享
    } catch (error) {
      console.log(error);
      this.showMessage('error', '点读记录提交失败');
    } finally {
      this.submiting = false;
      wx.hideLoading();
    }
  },
  setRemindTime(hour, minute) {
    if (!hour && !minute) {
      return;
    }
    const time = (hour || 0) * 3600 + (minute || 0) * 60;
    this.setData({
      remindCountDown: time * 1000
    });
  },
  playRemindBgm() {
    let count = 0;
    const audioContext = this.data.remindAudioContext;
    audioContext.src = 'https://oss.lhdd.club/music/ring.mp3';
    audioContext.onEnded(() => {
      count += 1;
      if (count === 3) {
        audioContext.destroy();
        this.setData({
          remindAudioContext: null
        });
      } else {
        audioContext.seek(0);
        audioContext.play();
      }
    });
    audioContext.play();
  },
  onLoad(options) {
    const defalutList = [
      {
        value: null,
        label: '无'
      },
      {
        value: 'loop',
        label: '列表默认循环'
      }
    ];
    const newBgmList = [
      {
        value: 'https://oss.lhdd.club/music/read_bgm_1.mp3',
        label: '古筝 - 古风温馨春华秋实'
      },
      {
        value: 'https://oss.lhdd.club/music/read_bgm_2.mp3',
        label: '古筝 - 中国风 余音绕梁'
      }
    ];
    this.setData({
      bgmInfo: newBgmList[0],
      bgmList: defalutList.concat(newBgmList),
      bookId: options.bookId
    });
    const bgm = wx.getBackgroundAudioManager();
    const audioContext = wx.createInnerAudioContext({
      useWebAudioImplement: false
    });
    this.setData({
      bgm,
      remindAudioContext: audioContext
    });
  },
  onUnload() {
    this.resetData();
    this.stopBgm();
    this.setData({
      bgm: null,
      remindAudioContext: null
    });
  },
  resetData() {
    this.setData({
      countdown: 0,
      countdown_ui: {
        hh: '00',
        mm: '00',
        ss: '00'
      },
      resultTimes: '',
      resultFeedback: '',
      remindCountDown: 0,
      resultPopup: false,
      step: 1,
      isReading: false
    });
  },
  stopBgm() {
    if (this.data.bgm) {
      this.data.bgm.startTime = 0;
      this.data.bgm.stop();
    }
    if (this.data.remindAudioContext) {
      this.data.remindAudioContext.stop();
    }
    clearInterval(this.data.countdown_interval);
  },
  toggleReading() {
    const isReading = this.data.isReading;
    if (isReading) {
      this.data.bgm?.pause();
      this.data.remindAudioContext?.pause();
      clearInterval(this.data.countdown_interval);
    } else {
      this.startCountdown();
    }
    this.setData({
      isReading: !isReading
    });
  }
});
