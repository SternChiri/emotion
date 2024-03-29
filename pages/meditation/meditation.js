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
    currentTime: '00:00',
    tags: ['全部'],
    selectedTag: '全部',
    backgroundColorMap: {
      '纯音乐': '#15AA93',
      '缓解焦虑': '#87CEEB',
      '正念': '#FFA07A',
      '探索': '#FF6347',
      '减压': '#FFA07A',
      '潜力开发': '#FF8C00',
      '放松': '#FFC3E6',
      '冥想': '#00BFFF',
      '印度': '#2012AA',
      '自我肯定': '#FFD700',
      '助眠': '#FFB6C1',


      '克服恐惧': '#FFD9EC',

    },
    searchResult: []
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
    innerAudioContext.onEnded(() => {
      this.playMusicById(this.data.currentMusic._id);
    });
    this.setData({
      innerAudioContext: innerAudioContext
    });
  },

  getMusics: function () {
    wx.cloud.callFunction({
      name: 'getMeditationData',
      success: res => {
        const searchResult = res.result;
        const tagCountMap = {};
        searchResult.forEach(item => {
          item.tag.forEach(tag => {
            tagCountMap[tag] = (tagCountMap[tag] || 0) + 1;
          });
        });
        const tagCountArray = Object.entries(tagCountMap);
        tagCountArray.sort((a, b) => b[1] - a[1]);
        const tags = tagCountArray.map(entry => entry[0]);
        this.setData({
          searchResult,
          musics: searchResult,
          tags: ['全部', ...tags]
        });
        this.filterListByTag('全部');
      },
      fail: err => {
        console.error('调用云函数失败：', err);
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

  onInputChange: function (event) {
    const searchText = event.detail.value;
    this.setData({
      noResultMessage: ''
    });
    const searchResult = this.data.musics.filter(music => {
      return music.name.toLowerCase().includes(searchText.toLowerCase());
    });
    if (searchResult.length > 0) {
      this.setData({
        searchResult: searchResult
      });
    } else {
      this.setData({
        searchResult: [],
        noResultMessage: '没有找到你想找的内容哦~请换个词试试！'
      });
    }
  },  

  // 用户选择类别时触发的事件处理程序
  onTagChange: function (event) {
    const selectedTagIndex = event.detail.value;
    const selectedTag = this.data.tags[selectedTagIndex];
    this.setData({
      selectedTag: selectedTag
    });
    this.filterListByTag(selectedTag);
  },

  // 根据标签筛选列表
  filterListByTag: function (selectedTag) {
    if (selectedTag === '全部') {
      this.setData({
        searchResult: this.data.musics
      });
    } else {
      const searchResult = this.data.musics.filter(music => {
        return music.tag.includes(selectedTag);
      });
      this.setData({
        searchResult: searchResult
      });
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