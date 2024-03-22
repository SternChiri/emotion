// app.js
App({
  onLaunch() {
    // 初始化云开发服务
    wx.cloud.init({
      env: 'emotion-7gazfr5v6f07338a', // 环境ID
      traceUser: true, // 是否要捕获每个用户的访问记录
    });
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    // 尝试从本地缓存中获取登录状态
    const openid = wx.getStorageSync('openid') || false;
    if (openid) {
      console.log('用户已登录');
      wx.navigateTo({
        url: '/pages/index/index.wxml',
      })
    } else {
      console.log('用户未登录，尝试登录中...');
      wx.cloud.callFunction({
        name: 'wxacode-getSession',
        success: res => {
          console.log('获取 openid 成功');
          wx.setStorageSync('openid', res.result.openid);
        },
        fail: err => {
          console.error('获取 openid 失败', err);
        }
      });
    };
    console.log(wx.getSystemInfoSync().wxsSupport);
  },
  globalData: {
    userInfo: null
  }
})