// pages/welcome/welcome.js
Page({
  onLoad(options) {
    const rawTarget = options.target || '';
    const decodedTarget = decodeURIComponent(rawTarget);

    console.log('中间页接收到跳转目标:', decodedTarget);

    // 提取纯路径（去掉 query 参数）
    const cleanPath = decodedTarget.split('?')[0];

    // 确保路径以 / 开头
    const fullPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

    console.log('refresh path:', fullPath);

    wx.switchTab({
      //   url: fullPath
      url: '/pages/home/home'
    });
  }
});
