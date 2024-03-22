Page({
  data: {
    musicUrl: 'cloud://your-cloud-storage-bucket/music.mp3',
  },

  playMusic: function() {
    const audio = this.selectComponent('.music-player audio');
    audio.play();
  },

  pauseMusic: function() {
    const audio = this.selectComponent('.music-player audio');
    audio.pause();
  },

  stopMusic: function() {
    const audio = this.selectComponent('.music-player audio');
    audio.stop();
  },
});
