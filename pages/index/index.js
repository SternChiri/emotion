// index.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    todayDate: getTodayDate(),
    showWindow: false,
    showFloatWindow: false,
    showInformedWindow: false,
    contentList: [],
    windowItem: {},
    quoteRecord: {},
    selectedValue1: 0,
    selectedValue2: 0,
    selectedWord1: '中立',
    selectedWord2: '中立',
    colors: [],
    meanings: [
      "绝望", "冷漠", "麻木", "消沉", "憔悴", "担忧", "痛苦", "悲痛", "癫狂",
      "抑郁", "压抑", "悲伤", "沉重", "厌烦", "生气", "愤怒", "暴怒", "狂怒",
      "郁闷", "苦闷", "失落", "沮丧", "不安", "忧虑", "焦虑", "烦躁", "暴躁",
      "萎靡", "灰心", "泄气", "无奈", "失意", "紧张", "害怕", "惶恐", "恐惧",
      "困倦", "迷糊", "疲倦", "慵懒", "平静", "惊讶", "惊奇", "震惊", "激动",
      "安定", "安闲", "安逸", "安静", "淡定", "舒畅", "开心", "欢欣", "兴奋",
      "安宁", "平和", "镇定", "宁静", "舒适", "雀跃", "愉快", "惊喜", "亢奋",
      "安详", "自在", "放松", "安心", "欣慰", "欣喜", "快乐", "狂喜", "热情",
      "祥和", "陶醉", "惬意", "满足", "满意", "欢乐", "高兴", "幸福", "热忱"
    ],
    selectedMeaning: [], // 当前选定的组合
    words1: {
      '-4': '极度不愉悦',
      '-3': '很不愉悦',
      '-2': '不愉悦',
      '-1': '轻微不愉悦',
      '0': '中性',
      '1': '轻微愉悦',
      '2': '愉悦',
      '3': '很愉悦',
      '4': '极度愉悦',
    },
    words2: {
      '-4': '昏昏欲睡',
      '-3': '半睡半醒',
      '-2': '低沉',
      '-1': '低落',
      '0': '平静',
      '1': '清醒',
      '2': '觉醒',
      '3': '强烈',
      '4': '极度强烈',
    },
    inputValue: '',
    clickedMeaning: [],
    isSelected: false,
    selectedItems: []
  },

  onLoad: function () {
    const openid = wx.getStorageSync('openid') || false;
    if (openid) {
      this.setData({
        showInformedWindow: false,
      })
    } else {
      this.setData({
        showInformedWindow: true,
      })
    };

    // 查询集合总记录数
    db.collection('quote').count().then(res => {
      // 生成随机数
      const totalRecords = res.total;
      const randomIndex = Math.floor(Math.random() * totalRecords);

      // 根据随机数选取记录
      db.collection('quote').skip(randomIndex).limit(1).get().then(res => {
        // 将选取的记录存储到数据变量中
        this.setData({
          quoteRecord: res.data[0]
        });
      }).catch(err => {
        console.error('随机选取记录失败：', err);
      });
    }).catch(err => {
      console.error('获取集合总记录数失败：', err);
    });

    // 在页面加载时调用云数据库
    db.collection('article').get({
      success: res => {
        this.setData({
          contentList: res.data
        })
      },
      fail: err => {
        console.error('获取article数据失败：', err)
      }
    });
    this.checkDiaryExistence()
  },

  checkDiaryExistence: function () {
    const openid = wx.getStorageSync('openid');
    const today = new Date().toLocaleDateString();
    db.collection('user')
      .where({
        _openid: openid
      })
      .get()
      .then(res => {
        const diary = res.data[0].diary;
        if (diary.length > 0) {
          const latestDiary = diary[diary.length - 1];
          const diaryDate = new Date(latestDiary.time).toLocaleDateString();
          if (diaryDate === today) {
            this.setData({
              latestDiary: latestDiary,
              isDiaryExist: true
            });
            this.judgeColor(latestDiary.coordinate[0], latestDiary.coordinate[1])

          } else {
            this.setData({
              isDiaryExist: false
            });
          }

        } else {
          this.setData({
            isDiaryExist: false
          });
        }
      })
      .catch(err => {
        console.error("查询用户日记失败", err);
      });
  },

  goToDiary() {
    wx.navigateTo({
      url: '/pages/diary/diary',
    });
  },

  openWindow(event) {
    const item = event.currentTarget.dataset.item;
    this.setData({
      showWindow: true,
      windowItem: item,
    });
  },
  closeWindow() {
    this.setData({
      showWindow: false,
    });
  },

  openFloatWindow() {
    this.setData({
      showFloatWindow: true,
      selectedValue1: 0,
      selectedValue2: 0,
      selectedWord1: this.data.words1['0'],
      selectedWord2: this.data.words2['0']
    });
  },
  closeFloatWindow() {
    this.setData({
      showFloatWindow: false,
      selectedMeaning: []
    });
  },

  closeInformedWindow() {
    this.setData({
      showInformedWindow: false
    });
  },

  handleSliderChange1: function (event) {
    const value = event.detail.value; // 获取滑动条的值
    const value1 = value; // 将滑动条的值赋给 value1
    const value2 = this.data.selectedValue2; // 获取滑动条2的值
    const index = (value1 + 4) * 9 + (value2 + 4); // 计算组合的索引
    let indexes;
    if ([9, 18, 27, 36, 45, 54, 63, 72].includes(index)) {
      indexes = [index, index + 1, index - 9, index + 9];
    } else if ([8, 17, 26, 35, 44, 53, 62, 71].includes(index)) {
      indexes = [index, index - 1, index - 9, index + 9];
    } else {
      indexes = [index, index - 1, index + 1, index - 9, index + 9];
    }
    const selectedMeaning = indexes.map(idx => this.data.meanings[idx]); // 获取选定及其周围的值，并存入数组

    this.setData({
      selectedValue1: value1,
      selectedMeaning: selectedMeaning,
      selectedWord1: this.data.words1[value.toString()],
      clickedMeaning: [],
      selectedItems: []
    });
  },

  hdSldChanging1: function (event) {
    const value = event.detail.value;
    this.setData({
      selectedWord1: this.data.words1[value.toString()],
      clickedMeaning: [],
      selectedItems: []
    });
  },

  handleSliderChange2: function (event) {
    const value = event.detail.value;
    const value2 = value;
    const value1 = this.data.selectedValue1;
    const index = (value1 + 4) * 9 + (value2 + 4);
    let indexes;
    if ([9, 18, 27, 36, 45, 54, 63, 72].includes(index)) {
      indexes = [index, index + 1, index - 9, index + 9];
    } else if ([8, 17, 26, 35, 44, 53, 62, 71].includes(index)) {
      indexes = [index, index - 1, index - 9, index + 9];
    } else {
      indexes = [index, index - 1, index + 1, index - 9, index + 9];
    }
    const selectedMeaning = indexes.map(idx => this.data.meanings[idx]);

    this.setData({
      selectedValue2: value2,
      selectedMeaning: selectedMeaning,
      selectedWord2: this.data.words2[value.toString()],
      clickedMeaning: [],
      selectedItems: []
    });
  },

  hdSldChanging2: function (event) {
    const value = event.detail.value;
    this.setData({
      selectedWord2: this.data.words2[value.toString()],
      clickedMeaning: [],
      selectedItems: []
    });
  },

  toggleSelectedMeaning: function (event) {
    const index = event.currentTarget.dataset.index;
    const value = event.currentTarget.dataset.value;
    const clickedMeaning = this.data.clickedMeaning;
    const existingIndex = clickedMeaning.indexOf(value);
    const selectedItems = this.data.selectedItems;
    if (existingIndex !== -1) {
      clickedMeaning.splice(existingIndex, 1);
    } else {
      clickedMeaning.push(value);
    }
    selectedItems[index] = !selectedItems[index];
    this.setData({
      clickedMeaning: clickedMeaning,
      selectedItems: selectedItems
    });
  },

  handleInput: function (event) {
    const value = event.detail.value;
    this.setData({
      inputValue: value
    });
  },

  handleSubmit: function (event) {
    const valence = this.data.selectedValue1;
    const arousal = this.data.selectedValue2;
    const clkMeaning = this.data.clickedMeaning;
    const idea = this.data.inputValue;
    const openid = wx.getStorageSync('openid');
    const time = new Date();
    if (clkMeaning.length === 0) {
      wx.showToast({
        title: '请至少选择一个情绪！',
        icon: 'none',
        duration: 1500
      });
      return; // 中止函数执行
    }
    const diaryObject = {
      coordinate: [valence, arousal],
      emoWords: clkMeaning,
      idea: idea,
      time: time
    };
    db.collection('user').where({
      _openid: openid
    }).update({
      data: {
        diary: db.command.push(diaryObject)
      },
      success: function (res) {
        wx.showToast({
          title: '记录成功！',
          icon: 'success',
          duration: 1000
        });
        console.log("成功更新心情日记", res);
      },
      fail: function (err) {
        console.error("更新心情日记失败", err);
      }
    });
    this.checkDiaryExistence();
    this.closeFloatWindow();
  },

  judgeColor: function (value1, value2) {

    const index = (value1 + 4) * 9 + (value2 + 4);
    const polar = this.cartesianToPolar(value1, value2)
    const color = this.polarToColor(polar.r, polar.theta);
    const colors = this.data.colors;
    colors[index] = color;
    this.setData({
      colors: colors,
      index: index
    });
  },
  cartesianToPolar: function (x, y) {
    const r = Math.sqrt(x * x + y * y);
    let theta = Math.atan2(y, x);
    const degrees = (theta * (180 / Math.PI) - 45).toFixed(2);
    return {
      r: r.toFixed(2),
      theta: degrees
    };
  },

  polarToColor: function (r, theta) {
    const opacity = r / (4 * Math.sqrt(2)) * 0.5;
    let hue = ((theta % 360) + 360) % 360;
    if (theta + (180 % 360) === 180) {
      hue = (hue + 180) % 360;
    }
    const rgbColor = this.hsvToRgb(hue, 0.8, 0.8);
    const color = `rgba(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]}, ${opacity})`;
    return color;
  },
  hsvToRgb: function (h, s, v) {
    let r, g, b;
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
  },
  onShareAppMessage() {
    return {
      title: '你今天心情如何？',
      path: '/pages/index/index',
    }
  },
  onShareTimeline() {
    return {
      title: '你今天心情如何？'
    }
  }
});

function getTodayDate() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekDay = weekDays[now.getDay()];

  return `${month}月${day}日\n周${weekDay}`;
}