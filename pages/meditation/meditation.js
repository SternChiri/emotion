Page({
  data: {
    musicUrl: 'cloud://your-cloud-storage-bucket/meditation.mp3',
    isPlaying: false,
    currentTime: 0,
    duration: 0,
  },

  onLoad: function() {
    const audio = this.selectComponent('.meditation-player audio');
    audio.onCanplay(() => {
      this.setData({
        duration: audio.duration,
      });
    });
  },

  playMusic: function() {
    const audio = this.selectComponent('.meditation-player audio');
    audio.play();
    this.setData({
      isPlaying: true,
    });
  },

  pauseMusic: function() {
    const audio = this.selectComponent('.meditation-player audio');
    audio.pause();
    this.setData({
      isPlaying: false,
    });
  },

  stopMusic: function() {
    const audio = this.selectComponent('.meditation-player audio');
    audio.stop();
    this.setData({
      isPlaying: false,
      currentTime: 0,
    });
  },

  onTimeUpdate: function(e) {
    this.setData({
      currentTime: e.detail.currentTime,
    });
  },
});
