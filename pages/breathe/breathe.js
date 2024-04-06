Page({
  data: {
    animationData: {}, // 存储动画数据
    breathText: '', // 存储呼吸提示文本
    enlargeTimer: null,
    pauseTimer: null,
    shrinkTimer: null,
    showInstruction: true, // 控制是否显示说明页面
    isBreathing: false, // 控制是否正在进行呼吸练习
    startTime: null, // 记录开始时间
    elapsedTime: 0, // 记录经过的时间（秒）
    timer: null // 计时器对象
  },

  // 页面加载时执行的函数
  onLoad: function () {
    // 初始化呼吸练习状态
    this.resetBreathing();
    this.startTimer(); // 在页面加载时开始计时
  },

  onUnload: function () {
    this.stopTimerAndPrintResult(); // 在页面卸载时停止计时并打印结果
  },

  startTimer: function () {
    this.setData({ startTime: Date.now() }); // 设置开始时间为当前时间
    // 每秒更新经过的时间
    this.data.timer = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = Math.floor((currentTime - this.data.startTime) / 1000); // 将毫秒转换为秒
      this.setData({ elapsedTime });
    }, 1000); // 每秒更新一次
  },

  stopTimerAndPrintResult: function () {
    clearInterval(this.data.timer); // 停止计时器
    const elapsedTime = this.data.elapsedTime;
    // 构造要存储的数据对象
    const dataToSave = {
      method: '呼吸训练',
      span: elapsedTime
    };
    // 调用云函数保存数据到数据库
    wx.cloud.callFunction({
      name: 'saveDataToDatabase',
      data: {
        data: dataToSave
      },
      success: res => {
        console.log('数据保存成功', res);
      },
      fail: err => {
        console.error('数据保存失败', err);
      }
    });
  },  

  // 初始化呼吸练习状态函数
  resetBreathing: function () {
    // 清空动画数据和呼吸提示文本
    this.setData({
      animationData: {},
      breathText: '',
      showInstruction: true,
      isBreathing: false
    });
  },


  startBreathe: function () {
    this.setData({
      showInstruction: false,
    })
  },
  startAnimation: function () {
    if (!this.data.isBreathing) {
      this.setData({
        isBreathing: true
      });
      this.enlargeAnimation();
    }
  },
  // 放大动画函数
  enlargeAnimation: function () {
    const animation = wx.createAnimation({
      duration: 4000,
      timingFunction: 'linear',
    });
    animation.scale(2, 2).step();
    this.setData({
      animationData: animation.export(),
      breathText: '吸气',
    });
    let enlargeTimer = setTimeout(() => {
      this.pauseAnimation();
    }, 4000);
    this.setData({
      enlargeTimer: enlargeTimer
    })
  },

  // 暂停动画函数
  pauseAnimation: function () {
    const animation = wx.createAnimation({
      duration: 7000,
    });
    animation.scale(2, 2).step();
    this.setData({
      animationData: animation.export(),
      breathText: '屏息',
    });
    let pauseTimer = setTimeout(() => {
      this.shrinkAnimation();
    }, 7000);
    this.setData({
      pauseTimer: pauseTimer
    })
  },

  // 缩小动画函数
  shrinkAnimation: function () {
    const animation = wx.createAnimation({
      duration: 8000,
      timingFunction: 'linear',
    });
    animation.scale(1, 1).step();
    this.setData({
      animationData: animation.export(),
      breathText: '呼气'
    });
    let shrinkTimer = setTimeout(() => {
      this.enlargeAnimation();
    }, 8000);
    this.setData({
      shrinkTimer: shrinkTimer
    })
  },

  // 停止呼吸练习按钮点击事件处理函数
  stopAnimation: function () {
    clearTimeout(this.data.enlargeTimer);
    clearTimeout(this.data.pauseTimer);
    clearTimeout(this.data.shrinkTimer);
    const animation = wx.createAnimation({
      duration: 0, 
    });
    animation.scale(1, 1).step();
    this.setData({
      animationData: animation.export(),
      breathText: '',
      isBreathing: false
    });
  }
});