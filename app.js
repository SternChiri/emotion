// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })

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

