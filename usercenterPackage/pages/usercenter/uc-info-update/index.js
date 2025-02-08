// pages/usercenter/suggest/suggest.js
import dayjs from 'dayjs';
import Message from 'tdesign-miniprogram/message/index';
import { host, api, post, wait } from '../../../../utils/util';

const keys = ['photo', 'name', 'gender', 'birth', 'age', 'career', 'leftEyes', 'rightEyes', 'height', 'weight', 'userId'];
const getFilterInfo = (userInfo) => {
  return keys.reduce((acc, k) => {
    acc[k] = userInfo[k];
    return acc;
  }, {});
};

Page({
  data: {
    info: {},
    sexVisible: false,
    sexOptions: [
      { value: 1, label: '男' },
      { value: 0, label: '女' }
    ],
    dateVisible: false,
    defaultDate: dayjs().subtract(15, 'year').valueOf(),
    endDate: new Date().getTime(),
    recentUpdateTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
  },
  onLoad() {
    this.init();
  },
  openSexPicker() {
    this.setData({
      sexVisible: true
    });
  },
  onSexPickerChange(e) {
    const { value } = e.detail;
    this.setData({
      info: {
        ...this.data.info,
        gender: value[0]
      },
      sexVisible: false
    });
  },
  onSexPickerCancel() {
    this.setData({
      sexVisible: false
    });
  },
  openBirthDayPicker() {
    const { birth } = this.data.info;
    this.setData({
      dateVisible: true,
      defaultDate: birth ? new Date(birth).getTime() : new Date().getTime()
    });
  },
  onBirthDayConfirm(e) {
    const { value } = e.detail;
    this.setData({
      info: {
        ...this.data.info,
        birth: value,
        age: dayjs().diff(dayjs(value), 'year')
      },
      dateVisible: false
    });
  },
  onBirthDayCancel() {
    this.setData({
      dateVisible: false
    });
  },
  // 输入框输入时
  onInput(e) {
    const { value } = e.detail;
    const { name } = e.currentTarget.dataset;
    this.setData({
      info: {
        ...this.data.info,
        [name]: value
      }
    });
  },
  // 初始化获取用户资料
  async init() {
    const userInfo = wx.getStorageSync('userInfo');
    const info = await post(api.User.data, {
      userId: userInfo.id
    });
    if (!info) {
      this.setData({
        info: {
          userId: userInfo.id
        }
      });
      return;
    }
    const newInfo = getFilterInfo(info);
    console.log(newInfo);
    this.setData({
      info: newInfo,
      recentUpdateTime: dayjs(info.createdAt).format('YYYY-MM-DD HH:mm:ss')
    });
  },
  async update() {
    const data = this.data.info;
    const requireKeys = keys.filter((v) => !['career', 'userId'].includes(v));
    if (requireKeys.some((v) => !data[v])) {
      this.showMessage('error', '请填写必填项');
      return;
    }
    if (this.updating) {
      return;
    }
    this.updating = true;
    wx.showLoading({
      title: '正在更新中...',
      mask: true
    });
    try {
      await post(api.User.updateInfo, { ...data, avatar: '' });
      this.showMessage('success', '更新成功');
      const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
      this.setData({
        recentUpdateTime: now
      });
      // await wait(1000);
      // wx.navigateBack();
      wx.navigateTo({
        url: '/usercenterPackage/pages/usercenter/uc-info-update/share/index',
        success: (res) => {
          res.eventChannel.emit('acceptDataFromOpenerPage', { data: { ...this.data.info, updateTime: now } });
        }
      });
    } catch (error) {
      console.log(error);
      this.showMessage('error', '更新失败');
    } finally {
      wx.hideLoading();
      this.updating = false;
    }
  },
  uploadAvatar(filePath) {
    return new Promise((resolve, reject) => {
      const token = wx.getStorageSync('token');
      wx.uploadFile({
        url: host + api.Public.upload,
        filePath,
        name: 'files',
        formData: {
          token
        },
        success(res) {
          if (res.statusCode !== 200) {
            reject({
              errMsg: '上传失败'
            });
            return;
          }
          const _res = JSON.parse(res.data);
          if (_res.status !== 200) {
            reject({
              errMsg: '上传失败'
            });
            return;
          }
          resolve(_res.msg[0]?.path);
        },
        fail(e) {
          console.log(e);
          reject(e);
        }
      });
    });
  },
  // async onChooseImage(e) {
  //   // TODO: 选择图片
  //   wx.chooseMedia({
  //     count: 1,
  //     mediaType: ['image'],
  //     success: async (res) => {
  //       const newAvatar = await this.uploadAvatar(res.tempFiles[0].tempFilePath);
  //       this.setData({
  //         info: {
  //           ...this.data.info,
  //           avatar: newAvatar
  //         }
  //       });
  //     },
  //     fail: (e) => {
  //       console.log(e);
  //       if (e.errMsg.indexOf('cancel') > -1) {
  //         return;
  //       }
  //       this.showMessage('error', '选择图片失败');
  //     }
  //   });
  // },
  onChooseImage() {
    wx.navigateTo({
      url: '/usercenterPackage/pages/usercenter/camera/camera',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: async ({ data }) => {
          console.log(data);
          try {
            const newAvatar = await this.uploadAvatar(data);
            this.setData({
              info: {
                ...this.data.info,
                photo: newAvatar
              }
            });
          } catch (error) {
            this.showMessage('error', '上传失败');
          }
        }
      }
    });
  },
  showMessage(type, content) {
    Message[type]({
      context: this,
      offset: [90, 32],
      duration: 3000,
      content
    });
  }
});
