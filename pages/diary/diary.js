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
      const color = this.judgeColor(item.coordinate[0], item.coordinate[1]);
      console.log(color);
      // 获取星期几并转换为文字表示
      const dayOfWeek = ['日', '一', '二', '三', '四', '五', '六'][itemTime.getDay()];
      const dayOfWeekText = `周${dayOfWeek}`;

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
        dayOfWeek: dayOfWeekText,
        time,
        color
      });
    }
    return processedData;
  },

  judgeColor: function (value1, value2) {
    const polar = this.cartesianToPolar(value1, value2)
    const color = this.polarToColor(polar.r, polar.theta);
    return color
  },
  cartesianToPolar: function (x, y) {
    const r = Math.sqrt(x * x + y * y);
    let theta = Math.atan2(y, x);
    const degrees = (theta * (180 / Math.PI) - 45).toFixed(2);
    return {
      r: r.toFixed(2),
      theta: degrees
    };
  },

  polarToColor: function (r, theta) {
    const opacity = r / (4 * Math.sqrt(2)) * 0.5;
    let hue = ((theta % 360) + 360) % 360;
    if (theta + (180 % 360) === 180) {
      hue = (hue + 180) % 360;
    }
    const rgbColor = this.hsvToRgb(hue, 0.8, 0.8);
    const color = `rgba(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]}, ${opacity})`;
    return color;
  },
  hsvToRgb: function (h, s, v) {
    let r, g, b;
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
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