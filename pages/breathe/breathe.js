// pages/breathe/breathe.js
// 在页面的js文件中实现呼吸放松调节法
Page({
  data: {
    animationData: {} // 用于存储动画数据
  },

  onLoad: function () {
    // 创建一个动画实例
    const animation = wx.createAnimation({
      duration: 6000, // 动画持续时间为1秒
      timingFunction: 'ease' // 使用缓动函数
    });

// 定义动画过程：从初始大小缩放到指定大小
animation.scale(2, 2).step();

    // 将动画数据存储到 data 中，以便在 WXML 中使用
    this.setData({
      animationData: animation.export()
    });
  }
})
