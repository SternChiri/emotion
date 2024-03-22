Page({
  data: {
    urls: [
      {
        title: '焦虑症的症状和治疗方法',
        url: 'https://www.mayoclinic.org/diseases-conditions/anxiety/symptoms-causes/syc-20350961'
      },
      {
        title: '如何应对焦虑',
        url: 'https://www.webmd.com/anxiety-panic/guide/anxiety-management'
      },
      {
        title: '焦虑症的治疗方法',
        url: 'https://www.healthline.com/health/anxiety/treatments'
      },
    ]
  },

  onItemClick: function(e) {
    const url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: `/pages/web/web?url=${url}`
    });
  }
});
