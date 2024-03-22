Page({
  data: {
    urls: [
      {
        title: '按摩简介',
        url: 'https://www.wikipedia.org/wiki/Massage',
      },
      {
        title: '按摩技巧',
        url: 'https://www.massagetoday.com/articles/massage-techniques',
      },
      {
        title: '按摩益处',
        url: 'https://www.mayoclinic.org/healthy-lifestyle/adult-health/in-depth/massage/art-20045850',
      },
      {
        title: '按摩类型',
        url: 'https://www.healthline.com/health/types-of-massage',
      },
    ],
  },

  onShareAppMessage: function() {
    return {
      title: '按摩分享',
      path: '/pages/massage/massage',
    };
  },
});
