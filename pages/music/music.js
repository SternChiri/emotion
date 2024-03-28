const db = wx.cloud.database();

Page({
  data: {
    musics: [],
    innerAudioContext: null,
    currentMusic: {
      name: '',
      url: '',
      isPlaying: false
    },
    currentIndex: 0 // 当前播放音乐的索引
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
          isPlaying: true
        },
        currentIndex: this.data.musics.findIndex(item => item._id === musicId) // 更新当前播放音乐的索引
      });
    } else {
      console.error('未找到对应的歌曲信息');
    }
  },
  pauseMusic: function () {
    const innerAudioContext = this.data.innerAudioContext;
    innerAudioContext.pause();
    this.setData({
      'currentMusic.isPlaying': false,
    });
  },
  resumeMusic: function () {
    const innerAudioContext = this.data.innerAudioContext;
    innerAudioContext.play();
    this.setData({
      'currentMusic.isPlaying': true,
    });
  },
  prevMusic: function () {
    let index = this.data.currentIndex - 1;
    if (index < 0) {
      index = this.data.musics.length - 1; // 如果当前是第一首音乐，则切换到最后一首
    }
    const music = this.data.musics[index];
    this.playMusicById(music._id);
  },
  nextMusic: function () {
    let index = this.data.currentIndex + 1;
    if (index >= this.data.musics.length) {
      index = 0; // 如果当前是最后一首音乐，则切换到第一首
    }
    const music = this.data.musics[index];
    this.playMusicById(music._id);
  },
  playMusicById: function (musicId) {
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
          isPlaying: true,
        },
        currentIndex: this.data.musics.findIndex(item => item._id === musicId) // 更新当前播放音乐的索引
      });
    } else {
      console.error('未找到对应的歌曲信息');
    }
  }
  
});