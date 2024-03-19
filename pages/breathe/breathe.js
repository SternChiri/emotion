Page({
  data: {
    animationData: {}, // 存储动画数据
    animationInterval: null, // 存储动画定时器
    breathText: '' // 存储呼吸提示文本
  },

  // 启动动画按钮点击事件处理函数
  startAnimation: function () {
    // 设置初始呼吸提示文本为空
    this.setData({
      breathText: ''
    });

    // 开始执行动画
    this.enlargeAnimation();
  },

  // 放大动画函数
  enlargeAnimation: function () {
    const animation = wx.createAnimation({
      duration: 2500, // 动画持续时间为2.5秒
      timingFunction: 'linear', // 线性变化
    });

    // 定义动画过程：从初始大小缩放到指定大小
    animation.scale(2, 2).step();

    // 更新动画数据和呼吸提示文本
    this.setData({
      animationData: animation.export(),
      breathText: '吸气'
    });

    // 设置定时器，2.5秒后执行缩小动画
    setTimeout(() => {
      this.shrinkAnimation();
    }, 2500); // 2500毫秒 = 2.5秒
  },

  // 缩小动画函数
  shrinkAnimation: function () {
    const animation = wx.createAnimation({
      duration: 2500, // 动画持续时间为2.5秒
      timingFunction: 'linear', // 线性变化
    });

    // 定义动画过程：从指定大小缩小到初始大小
    animation.scale(1, 1).step();

    // 更新动画数据和呼吸提示文本
    this.setData({
      animationData: animation.export(),
      breathText: '呼气'
    });

    // 设置定时器，2.5秒后再次执行放大动画
    setTimeout(() => {
      this.enlargeAnimation();
    }, 2500); // 2500毫秒 = 2.5秒
  },

  // 停止动画函数
  stopAnimation: function () {
    clearTimeout(this.data.animationInterval); // 清除定时器
    this.setData({
      animationData: {},
      breathText: '' // 停止时清空呼吸提示文本
    });
  }
});