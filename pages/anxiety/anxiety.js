// 导入云数据库模块
const db = wx.cloud.database();

Page({
  data: {
    articles: [], // 存储文章数据
  },

  // 页面加载时获取文章数据
  onLoad: function () {
    this.getArticles();
  },

  // 获取文章数据
  getArticles: function () {
    // 从云数据库中获取anxietyArticle集合的数据
    db.collection('anxietyArticle').get({
      success: res => {
        // 获取成功后将数据存储到页面数据中
        this.setData({
          articles: res.data
        });
      },
      fail: err => {
        // 获取失败时显示错误信息
        console.error('获取文章数据失败：', err);
      }
    });
  },
  navigateToAnxietyPage(event) {
    const item = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/anxiety/anxietyArticle?id=' + item._id
    });
  },
});