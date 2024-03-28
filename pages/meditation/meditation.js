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
    this.setData({
      innerAudioContext: innerAudioContext
    });
  },
  getMusics: function () {
    db.collection('meditation').get({
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
    const meditation = this.data.musics.find(item => item._id === musicId);
    if (meditation) {
      const innerAudioContext = this.data.innerAudioContext;
      innerAudioContext.pause();
      innerAudioContext.src = meditation.musicUrl;
      innerAudioContext.onCanplay(() => {
        innerAudioContext.play();
        this.setData({
          currentMusic: {
            name: meditation.name,
            url: meditation.musicUrl,
            time: meditation.time,
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
    const meditation = this.data.musics[index];
    this.playMusicById(meditation._id);
  },
  nextMusic: function () {
    let index = this.data.currentIndex + 1;
    if (index >= this.data.musics.length) {
      index = 0;
    }
    const meditation = this.data.musics[index];
    this.playMusicById(meditation._id);

  },
  playMusicById: function (musicId) {
    const meditation = this.data.musics.find(item => item._id === musicId);
    if (meditation) {
      const innerAudioContext = this.data.innerAudioContext;
      innerAudioContext.stop();
      innerAudioContext.src = meditation.musicUrl;
      innerAudioContext.onCanplay(() => {
        innerAudioContext.play();
        this.setData({
          currentMusic: {
            name: meditation.name,
            url: meditation.musicUrl,
            time: meditation.time,
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