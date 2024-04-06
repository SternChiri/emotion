// pages/evaResult/evaResult.js
const db = wx.cloud.database();

Page({
  data: {
    scaleId: '',
    score: 0,
    score_1: 0,
    result: null,
    scaleTitle: ''
  },

  onLoad(options) {
    const scaleId = options.id;
    const score = options.score;
    const score_1 = options.score_1;
    const total = parseInt(score) + parseInt(score_1);
    this.setData({
      scaleId,
      score,
      score_1,
      total
    });
    this.getBodyIndex();
    this.getResultFromDatabase(scaleId);
  },

  getResultFromDatabase(scaleId) {
    const scaleCollection = db.collection('scale');
    scaleCollection.doc(scaleId).get().then(res => {
      const scaleData = res.data;
      if (scaleData && scaleData.result) {
        this.setData({
          result: scaleData.result,
          scaleTitle: scaleData.title
        });
      } else {
        console.error('未找到量表结果数据或数据格式不正确');
      }
    }).catch(err => {
      console.error('获取量表结果数据失败：', err);
    });
  },

  getBodyIndex: function () {
    const that = this;
    wx.cloud.callFunction({
      name: 'judgeSubsection',
      data: {
        scaleId: that.data.scaleId,
        score: that.data.score,
        score_1: that.data.score_1
      }
    }).then(res => {
      const bodyIndex = res.result;
      that.setData({
        bodyIndex: bodyIndex
      });
    }).catch(err => {
      console.error('调用云函数失败', err);
    });
  },

  // 监听页面卸载
  onUnload() {
    wx.navigateBack({
      delta: 1
    });
  },

  onShareAppMessage() {
    const scaleId = this.data.scaleId;
    const score = this.data.score;
    const score_1 = this.data.score_1;
    return {
      title: '我的心理测评结果',
      path: '/pages/evaResult/evaResult?id=' + scaleId + '&score=' + score + '&score_1=' + score_1,
    };
  },  
  onShareTimeline() {
    return {
      title: '了解你自己。'
    }
  }
})