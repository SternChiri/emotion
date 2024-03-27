const db = wx.cloud.database();
Page({


  data: {
    anxietyId: ''
  },

  onLoad: function (options) {
    const anxietyId = options.id;
    if (!anxietyId) {
      console.error('缺少文章 ID');
      return;
    }
    this.setData({
      anxietyId: anxietyId,
    });
    this.getAnxietyData(anxietyId);
  },

  getAnxietyData: function (anxietyId) {
    const anxietyCollection = db.collection('anxietyArticle');
    anxietyCollection.doc(anxietyId).get().then(res => {
      const anxietyData = res.data;
      if (anxietyData) {

        this.setData({
          anxietyData: anxietyData,

        });

      } else {
        console.error('未找到文章');
      }
    }).catch(err => {
      console.error('获取文章失败：', err);
    });
  },
})