// pages/diary/diary.js
Page({
  data: {
    diaryList: [],
    renderData: false,
    processedDiaryList: [],
  },

  onLoad() {
    this.getDiaryList();
  },

  getDiaryList() {
    wx.cloud.callFunction({
      name: 'getDiaryList',
      success: res => {
        console.log('获取 diary 数组成功');
        const diaryList = res.result.diaryList ? res.result.diaryList : [];
        const processedDiaryList = this.processData(diaryList);
        this.setData({
          diaryList,
          processedDiaryList,
          renderData: true,
        });
      },
      fail: err => {
        console.error('获取 diary 数组失败', err);
      },
    });
  },

  processData(diaryList) {
    const processedData = [];
    let currentYear = null;
    let currentMonth = null;

    for (let i = 0; i < diaryList.length; i++) {
      const item = diaryList[i];
      const itemTime = new Date(item.time);
      const year = itemTime.getFullYear();
      const month = itemTime.getMonth() + 1;
      const day = itemTime.getDate();
      const hours = itemTime.getHours().toString().padStart(2, '0');
      const minutes = itemTime.getMinutes().toString().padStart(2, '0');
      const time = `${hours}:${minutes}`;
      if (year !== currentYear) {
        currentYear = year;
        currentMonth = null;
      }
      if (month !== currentMonth) {
        currentMonth = month;
      }
      processedData.push({
        ...item,
        year: currentYear,
        month: `${currentMonth}`,
        day: `${day}`,
        time,
      });
    }

    return processedData;
  },

  onShareAppMessage() {
    return {
      title: '来，和我一起记录心情~',
      path: '/pages/index/index',
    }
  },
  onShareTimeline() {
    return {
      title: '来，和我一起记录心情~'
    }
  }
});