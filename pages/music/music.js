const db = wx.cloud.database();
Page({
  data: {
    musics: [],
    innerAudioContext: null,
    currentMusic: {
      name: '',
      url: '',
      isPlaying: false,
      time: 0
    },
    currentIndex: 0,
    currentTime: '00:00'
  },
  onLoad: function () {
    this.getMusics();
    const innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.onTimeUpdate(() => {
      const currentTime = this.formatTime(innerAudioContext.currentTime);
      this.setData({
        'currentMusic.currentTime': currentTime
      });
    });
    innerAudioContext.onEnded(() => { // 监听音频播放结束事件
      this.playMusicById(this.data.currentMusic._id); // 重新播放当前音乐
    });
    this.setData({
      innerAudioContext: innerAudioContext
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
  formatTime: function (time) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    if (hours > 0) {
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
      return `${formattedMinutes}:${formattedSeconds}`;
    }
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
            ...music, // 将音乐的所有字段复制到 currentMusic 中
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
            ...music, // 将音乐的所有字段复制到 currentMusic 中
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
