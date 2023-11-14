// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    todayDate: getTodayDate(),
  },
  goToDetailPage() {
    // 处理点击“查看详情”按钮的逻辑
    wx.navigateTo({
      url: '/pages/detail/detail',
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