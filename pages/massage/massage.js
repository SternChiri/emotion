const db = wx.cloud.database();
Page({
  data: {
    articles: [], 
  },
 
  onLoad: function () {
    this.getArticles();
  },

  getArticles: function () {
    db.collection('massageArticle').get({
      success: res => {
        this.setData({
          articles: res.data
        });
        console.log(articles)
      },
      fail: err => {
        console.error('获取文章数据失败：', err);
      }
    });
  },
  navigateToMassagePage(event) {
    const item = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/massage/massageArticle?id=' + item._id
    });
  },
});