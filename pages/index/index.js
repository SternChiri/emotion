// index.js
const app = getApp()
const db = wx.cloud.database()

Page({
  data: {
    todayDate: getTodayDate(),
    showWindow: false,
    showFloatWindow: false,
    contentList: [],
    quoteRecord: {},
    selectedValue1: 0,
    selectedValue2: 0,
    selectedWord1: '中立',
    selectedWord2: '中立',
    meanings: [
      "组合1", "组合2", "组合3", "组合4", "组合5", "组合6", "组合7", "组合8", "组合9",
      "组合10", "组合11", "组合12", "组合13", "组合14", "组合15", "组合16", "组合17", "组合18",
      "组合19", "组合20", "组合21", "组合22", "组合23", "组合24", "组合25", "组合26", "组合27",
      "组合28", "组合29", "组合30", "组合31", "组合32", "组合33", "组合34", "组合35", "组合36",
      "组合37", "组合38", "组合39", "组合40", "组合41", "组合42", "组合43", "组合44", "组合45",
      "组合46", "组合47", "组合48", "组合49", "组合50", "组合51", "组合52", "组合53", "组合54",
      "组合55", "组合56", "组合57", "组合58", "组合59", "组合60", "组合61", "组合62", "组合63",
      "组合64", "组合65", "组合66", "组合67", "组合68", "组合69", "组合70", "组合71", "组合72",
      "组合73", "组合74", "组合75", "组合76", "组合77", "组合78", "组合79", "组合80", "组合81"
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
    })
  },

  goToDetailPage() {
    // 处理点击“查看详情”按钮的逻辑
    wx.navigateTo({
      url: '/pages/detail/detail',
    });
  },

  openWindow() {
    this.setData({
      showWindow: true,
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

  handleSliderChange1: function (event) {
    const value = event.detail.value; // 获取滑动条的值
    const value1 = value; // 将滑动条的值赋给 value1
    const value2 = this.data.selectedValue2; // 获取滑动条2的值
    const index = (value1 + 4) * 9 + (value2 + 4); // 计算组合的索引
    const indexes = [index, index - 1, index + 1, index - 9, index + 9]; // 获取选定及其周围的索引
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
      selectedWord1: this.data.words1[value.toString()]
    });
  },

  handleSliderChange2: function (event) {
    const value = event.detail.value;
    const value2 = value;
    const value1 = this.data.selectedValue1;
    const index = (value1 + 4) * 9 + (value2 + 4);
    const indexes = [index, index - 1, index + 1, index - 9, index + 9];
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
      selectedWord2: this.data.words2[value.toString()]
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
        console.log("成功更新心情日记", res);
      },
      fail: function (err) {
        console.error("更新心情日记失败", err);
      }
    });
    this.closeFloatWindow();
  }
});


// 获取今天的日期，包括月、日、星期
function getTodayDate() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekDay = weekDays[now.getDay()];

  return `${month}月${day}日\n周${weekDay}`;
}