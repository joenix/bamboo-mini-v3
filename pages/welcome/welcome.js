// pages/welcome/welcome.js
Page({
	switchToHome() {
		wx.switchTab({
			url: '/pages/home/home'  // 跳转到首页
		});
	}
});