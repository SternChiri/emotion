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
    });
  },
  closeFloatWindow() {
    this.setData({
      showFloatWindow: false,
    });
  },
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