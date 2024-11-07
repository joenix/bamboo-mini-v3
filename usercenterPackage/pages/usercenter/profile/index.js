// usercenterPackage/pages/usercenter/profile/index.js
import Message from 'tdesign-miniprogram/message/index';
import { host, api, post, wait } from '../../../../utils/util';

Page({
  data: {
    avatarUrl: '',
    nickname: '',
    userId: ''
  },
  onLoad() {
    this.init();
  },
  async onChooseAvatar(e) {
    const { avatarUrl } = e.detail;

    const ossUrl = await this.uploadAvatar(avatarUrl);
    this.setData({
      avatarUrl: ossUrl
    });
  },
  onInput(e) {
    const { value } = e.detail;
    this.setData({
      nickname: value
    });
  },
  // 初始化获取用户资料
  async init() {
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      return;
    }
    this.setData({
      avatarUrl: userInfo.avatarUrl,
      nickname: userInfo.nickname,
      userId: userInfo.id
    });
  },
  async update() {
    if (this.updating) {
      return;
    }
    this.updating = true;
    wx.showLoading({
      title: '正在更新中...',
      mask: true
    });
    const { avatarUrl, nickname, userId } = this.data;
    try {
      await post(api.User.update + '?id=' + userId, {
        avatarUrl,
        nickname
      });
      this.showMessage('success', '更新成功');
      await wait(2000);
      wx.navigateBack();
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
          const _res = JSON.parse(res.data);
          if (res.statusCode !== 200 || _res.status !== 200) {
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
  showMessage(type, content) {
    Message[type]({
      context: this,
      offset: [90, 32],
      duration: 3000,
      content
    });
  }
});
