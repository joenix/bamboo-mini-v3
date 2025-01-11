// usercenterPackage/pages/usercenter/camera/camera.js
Page({
  data: {
    position: 'front'
  },
  onShow() {
    this.ctx = wx.createCameraContext();
  },
  switchDevicePosition() {
    this.setData({
      position: this.data.position === 'front' ? 'back' : 'front'
    });
  },
  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.emit('acceptDataFromOpenedPage', { data: res.tempImagePath });
        wx.navigateBack();
      }
    });
  },
  error(e) {
    console.log(e.detail);
  }
});
