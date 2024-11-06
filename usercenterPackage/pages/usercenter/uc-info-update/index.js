// pages/usercenter/suggest/suggest.js
import Message from 'tdesign-miniprogram/message/index';
import {
  api,
  post,
  wait
} from '../../../../utils/util';

Page({
  data: {
    userInfo: {},
    avatarEdited: false,
  },
  onLoad() {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    });
    this.init(userInfo.id);
  },
  // 输入框输入时
  onInput(e) {
    const {
      value
    } = e.detail;
    const {
      name
    } = e.currentTarget.dataset;
    this.setData({
      userInfo: {
        ...this.data.userInfo,
        [name]: value,
      }
    })
  },
  // 初始化获取用户资料
  async init(userId) {
    const userInfo = await post(api.User.data, {
      userId
    });
    if (userInfo) {
      this.setData({
        userInfo: userInfo[userInfo.length - 1]
      });
    }
  },
  showMessage(type, content) {
    Message[type]({
      context: this,
      offset: [90, 32],
      duration: 3000,
      content
    });
  },
  async update() {
    const {avatarUrl, ...rest} = this.data.userInfo;
    wx.showLoading({
      title: '正在更新中...'
    });
    let ossUrl = avatarUrl;
    try {
      if (this.data.avatarEdited) {
        ossUrl = await this.uploadAvatar(avatarUrl);
        if (!ossUrl) {
          throw new Error('上传头像失败');
        }
      }
      await post(api.User.updateInfo, {
        ...rest,
        avatar: ossUrl
      });
      this.showMessage('success', '更新成功')
      await wait(2000);
      wx.navigateBack();
    } catch (error) {
      this.showMessage('error', '更新失败')
    } finally {
      wx.hideLoading();
    }
  },
  uploadAvatar(filePath) {
    return new Promise((resolve, reject) => {
      const token = wx.getStorageSync('token')
      wx.uploadFile({
        url: api.Public.upload,
        filePath,
        name: 'files',
        formData: {
          token
        },
        success (res){
          const _res = res.data;
          if (res.statusCode !== 200 || _res.status !== 200) {
            reject({ errMsg: '上传失败' });
            return;
          }
          resolve(_res.msg[0]?.path)
        },
        fail(e){
          reject(e);
        }
      })
    })
  },
  onChooseAvatar(e) {
    const {
      avatarUrl
    } = e.detail
    this.setData({
      userInfo: {
        ...this.data.userInfo,
        avatarUrl,
      },
      avatarEdited: true
    })
  }
});