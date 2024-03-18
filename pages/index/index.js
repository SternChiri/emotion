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
      "组合意义1", "组合意义2", "组合意义3", "组合意义4", "组合意义5", "组合意义6", "组合意义7", "组合意义8", "组合意义9", "组合意义10",
      "组合意义11", "组合意义12", "组合意义13", "组合意义14", "组合意义15", "组合意义16", "组合意义17", "组合意义18", "组合意义19", "组合意义20",
      "组合意义21", "组合意义22", "组合意义23", "组合意义24", "组合意义25", "组合意义26", "组合意义27", "组合意义28", "组合意义29", "组合意义30",
      "组合意义31", "组合意义32", "组合意义33", "组合意义34", "组合意义35", "组合意义36", "组合意义37", "组合意义38", "组合意义39", "组合意义40",
      "组合意义41", "组合意义42", "组合意义43", "组合意义44", "组合意义45", "组合意义46", "组合意义47", "组合意义48", "组合意义49", "组合意义50",
      "组合意义51", "组合意义52", "组合意义53", "组合意义54", "组合意义55", "组合意义56", "组合意义57", "组合意义58", "组合意义59", "组合意义60",
      "组合意义61", "组合意义62", "组合意义63", "组合意义64", "组合意义65", "组合意义66", "组合意义67", "组合意义68", "组合意义69", "组合意义70",
      "组合意义71", "组合意义72", "组合意义73", "组合意义74", "组合意义75", "组合意义76", "组合意义77", "组合意义78", "组合意义79", "组合意义80",
      "组合意义81", "组合意义82", "组合意义83", "组合意义84", "组合意义85", "组合意义86", "组合意义87", "组合意义88", "组合意义89", "组合意义90",
      "组合意义91", "组合意义92", "组合意义93", "组合意义94", "组合意义95", "组合意义96", "组合意义97", "组合意义98", "组合意义99", "组合意义100",
      "组合意义101", "组合意义102", "组合意义103", "组合意义104", "组合意义105", "组合意义106", "组合意义107", "组合意义108", "组合意义109", "组合意义110",
      "组合意义111", "组合意义112", "组合意义113", "组合意义114", "组合意义115", "组合意义116", "组合意义117", "组合意义118", "组合意义119", "组合意义120",
      "组合意义121",
    ],
    selectedMeaning: "", // 当前选定的组合意义
    words1: {
      '-5': '非常不满意',
      '-4': '不满意',
      '-3': '一般',
      '-2': '满意',
      '-1': '非常满意',
      '0': '中立',
      '1': '非常不舒服',
      '2': '不舒服',
      '3': '一般',
      '4': '舒服',
      '5': '非常舒服'
    },
    words2: {
      '-5': '非常不满意',
      '-4': '不满意',
      '-3': '一般',
      '-2': '满意',
      '-1': '非常满意',
      '0': '中立',
      '1': '非常不舒服',
      '2': '不舒服',
      '3': '一般',
      '4': '舒服',
      '5': '非常舒服'
    },

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
    });
  },
  handleSliderChange1: function (event) {
    const value = event.detail.value; // 获取滑动条的值
    const value1 = value; // 将滑动条的值赋给 value1
    const value2 = this.data.selectedValue2; // 获取滑动条2的值
    const index = (value1 + 5) * 11 + (value2 + 5); // 计算组合的索引
    const selectedMeaning = this.data.meanings[index]; // 获取对应的组合意义

    this.setData({
      selectedValue1: value1,
      selectedMeaning: selectedMeaning,
      selectedWord1: this.data.words1[value.toString()]
    });
  },

  handleSliderChange2: function (event) {
    const value = event.detail.value; // 获取滑动条的值
    const value2 = value; // 将滑动条的值赋给 value1
    const value1 = this.data.selectedValue1; // 获取滑动条1的值
    const index = (value1 + 5) * 11 + (value2 + 5); // 计算组合的索引
    const selectedMeaning = this.data.meanings[index]; // 获取对应的组合意义

    this.setData({
      selectedValue2: value2,
      selectedMeaning: selectedMeaning,
      selectedWord2: this.data.words2[value.toString()]
    });
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