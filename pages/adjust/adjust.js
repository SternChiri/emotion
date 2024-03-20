// pages/adjust/adjust.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  toBreathe() {
    wx.navigateTo({
      url: '/pages/breathe/breathe',
    })
  },
  toMeditation() {
    wx.navigateTo({
      url: '/pages/meditation/meditation',
    })
  },
  toMusic() {
    wx.navigateTo({
      url: '/pages/music/music',
    })
  },
})