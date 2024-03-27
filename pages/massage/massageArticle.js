const db = wx.cloud.database();
Page({
  data: {
    massageId: ''
  },

  onLoad: function (options) {
    const massageId = options.id;
    if (!massageId) {
      console.error('缺少文章 ID');
      return;
    }
    this.setData({
      massageId: massageId,
    });
    this.getMassageData(massageId);
  },

  getMassageData: function (massageId) {
    const massageCollection = db.collection('massageArticle');
    massageCollection.doc(massageId).get().then(res => {
      const massageData = res.data;
      if (massageData) {

        this.setData({
          massageData: massageData,

        });

      } else {
        console.error('未找到文章');
      }
    }).catch(err => {
      console.error('获取文章失败：', err);
    });
  },
})