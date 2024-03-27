const db = wx.cloud.database();

Page({
  data: {
    articles: [], 
  },

  onLoad: function () {
    this.getArticles();
  },

  getArticles: function () {
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