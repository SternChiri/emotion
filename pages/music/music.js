const db = wx.cloud.database();

Page({
  data: {
    musics: [],
    innerAudioContext: null, 
    currentMusic: {
      name: '',
      url: '',
    }
  },
  onLoad: function () {
    this.getMusics();
    this.setData({
      innerAudioContext: wx.createInnerAudioContext(), // 在页面加载时创建 InnerAudioContext 对象
    });
  },
  getMusics: function () {
    db.collection('music').get({
      success: res => {
        this.setData({
          musics: res.data
        });
      },
      fail: err => {
        console.error('获取音乐数据失败：', err);
      }
    });
  },
  playMusic: function (event) {
    const musicId = event.currentTarget.dataset.id;
    const music = this.data.musics.find(item => item._id === musicId);
    if (music) {
      const innerAudioContext = this.data.innerAudioContext;
      if (this.data.innerAudioContext) {
        innerAudioContext.stop(); 
      }
      innerAudioContext.src = music.musicUrl;
      innerAudioContext.play();
      this.setData({
        currentMusic: { 
          name: music.name,
          url: music.musicUrl,
        },
      });
    } else {
      console.error('未找到对应的歌曲信息');
    }
  },
  pauseMusic: function () {
    const innerAudioContext = this.data.innerAudioContext;
    innerAudioContext.pause();
  },
  resumeMusic: function () {
    const innerAudioContext = this.data.innerAudioContext;
    innerAudioContext.play();
  
  },
  
});