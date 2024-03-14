// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);

    // 尝试从本地缓存中获取登录状态
    const isLogged = wx.getStorageSync('isLogged') || false;
    if (isLogged) {
      console.log('用户已登录');
      // 用户已登录，可以进行其他操作，如跳转到首页等
    } else {
      console.log('用户未登录，尝试登录中...');
      wx.login({
        success: res => {
          if (res.code) {
            wx.cloud.callFunction({
              name: 'wxacode-getSession',
              data: { code: res.code },
              success: res => {
                console.log('获取 openid 成功', res.result);
                // 登录成功后，标记用户已登录状态
                wx.setStorageSync('isLogged', true);
              },
              fail: err => {
                console.error('获取 openid 失败', err);
              }
            });
          } else {
            console.error('登录失败！' + res.errMsg);
          }
        }
      });
    }

    // 初始化云开发服务
    wx.cloud.init({
      env: 'emotion-7gazfr5v6f07338a', // 环境ID
      traceUser: true, // 是否要捕获每个用户的访问记录
    })
  },
  globalData: {
    userInfo: null
  }
})
