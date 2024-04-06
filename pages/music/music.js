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
      '纯音乐': '#A3E1A6',
      '白噪音': '#D1B0E5',
      '钢琴': '#FFC08A'
    },
    searchResult: [],
    startTime: null, // 记录开始时间
    elapsedTime: 0, // 记录经过的时间（秒）
    timer: null
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
    this.startTimer(); 
  },

  startTimer: function () {
    this.setData({ startTime: Date.now() }); 
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
      method: '音乐疗法',
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

  getMusics: function () {
    db.collection('music').get({
      success: res => {
        const searchResult = res.data;
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
          searchResult: res.data,
          musics: searchResult,
          tags: ['全部', ...tags]
        });
        this.filterListByTag('全部');
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
    };
    this.stopTimerAndPrintResult();
  },

  onInputChange: function (event) {
    const searchText = event.detail.value;
    this.setData({
      noResultMessage: ''
    });
    db.collection('music').where({
      name: db.RegExp({
        regexp: searchText,
        options: 'i'
      })
    }).get().then(res => {
      if (res.data.length > 0) {
        this.setData({
          searchResult: res.data
        });
      } else {
        this.setData({
          searchResult: [],
          noResultMessage: '没有找到你想找的内容哦~请换个词试试！'
        });
      }
    }).catch(err => {
      console.error('搜索失败：', err);
    });
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
      db.collection('music').where({
        tag: selectedTag
      }).get().then(res => {
        this.setData({
          searchResult: res.data
        });
      }).catch(err => {
        console.error('数据库请求失败：', err); // 输出数据库请求失败的错误信息
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
