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
    currentIndex: 0
  },
  onLoad: function () {
    this.getMusics();
    this.setData({
      innerAudioContext: wx.createInnerAudioContext()
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
  onUnload: function () {
    const innerAudioContext = this.data.innerAudioContext;
    if (innerAudioContext) {
      innerAudioContext.stop();
      innerAudioContext.destroy();
    }
  },
  playMusic: function (event) {
    const musicId = event.currentTarget.dataset.id;
    const music = this.data.musics.find(item => item._id === musicId);
    if (music) {
      const innerAudioContext = this.data.innerAudioContext;
      innerAudioContext.pause();
      innerAudioContext.src = music.musicUrl;
      innerAudioContext.onCanplay(() => {
        innerAudioContext.play();
        this.setData({
          currentMusic: {
            name: music.name,
            url: music.musicUrl,
            isPlaying: true
          },
          currentIndex: this.data.musics.findIndex(item => item._id === musicId)
        });
      });
    } else {
      console.error('未找到对应的歌曲信息');
    }
  },
  togglePlayPause: function () {
    const innerAudioContext = this.data.innerAudioContext;
    const currentMusic = this.data.currentMusic;
    if (currentMusic.isPlaying) {
      innerAudioContext.pause();
    } else {
      innerAudioContext.play();
    }
    this.setData({
      'currentMusic.isPlaying': !currentMusic.isPlaying,
    });
  },
  prevMusic: function () {
    let index = this.data.currentIndex - 1;
    if (index < 0) {
      index = this.data.musics.length - 1;
    }
    const music = this.data.musics[index];
    this.playMusicById(music._id);
  },
  nextMusic: function () {
    let index = this.data.currentIndex + 1;
    if (index >= this.data.musics.length) {
      index = 0;
    }
    const music = this.data.musics[index];
    this.playMusicById(music._id);

  },
  playMusicById: function (musicId) {
    const music = this.data.musics.find(item => item._id === musicId);
    if (music) {
      const innerAudioContext = this.data.innerAudioContext;
      innerAudioContext.stop();
      innerAudioContext.src = music.musicUrl;
      innerAudioContext.onCanplay(() => {
        innerAudioContext.play();
        this.setData({
          currentMusic: {
            name: music.name,
            url: music.musicUrl,
            isPlaying: true
          },
          currentIndex: this.data.musics.findIndex(item => item._id === musicId)
        });
      });
    } else {
      console.error('未找到对应的歌曲信息');
    }
  }
});