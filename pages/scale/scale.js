// pages/scale/scale.js
const db = wx.cloud.database();
const app = getApp();
let lastClickedIndex = {
  sliced_1: null,
  sliced_2: null
};

Page({
  data: {
    scaleId: '',
    scaleData: {},
    scaleTitle: '',
    currentItemIndex: 0,
    currentQuestion: {},
    isInstruction: false,
    items: [],
    currentQuestionType: '',
    buttonIndex_1: null,
    buttonIndex_2: null,
    score: 0,
    score_1: 0
  },

  onLoad: function (options) {
    const scaleId = options.id;
    if (!scaleId) {
      console.error('缺少量表 ID');
      return;
    }
    this.setData({
      scaleId: scaleId,
      sliced_1_clicked: false,
      sliced_2_clicked: false,
    });
    this.getScaleData(scaleId);
  },

  getScaleData: function (scaleId) {
    const scaleCollection = db.collection('scale');
    scaleCollection.doc(scaleId).get().then(res => {
      const scaleData = res.data;
      if (scaleData && scaleData.items) {
        this.setData({
          items: scaleData.items,
          scaleTitle: scaleData.title
        });
        this.showNextItem();
      } else {
        console.error('未找到量表数据或数据格式不正确');
      }
    }).catch(err => {
      console.error('获取量表数据失败：', err);
    });
  },

  showNextItem: function () {
    let currentIndex = this.data.currentItemIndex;
    const items = this.data.items;
    const openid = wx.getStorageSync('openid');

    if (currentIndex < items.length) {
      const currentItem = items[currentIndex];
      if (currentItem.instruction) {
        this.setData({
          isInstruction: true,
          currentQuestion: currentItem
        });
      } else {
        this.setData({
          isInstruction: false,
          currentQuestion: currentItem,
          currentQuestionType: currentItem.type,
        });
        if (this.data.currentQuestionType === 'lsas') {
          this.setData({
            sliced_1: this.data.currentQuestion.options.slice(0, 4),
            sliced_2: this.data.currentQuestion.options.slice(4)
          });
        }
      }
      currentIndex++;
      this.setData({
        currentItemIndex: currentIndex
      });
    } else {
      const score = this.data.score;
      const score_1 = this.data.score_1;
      this.derivedScore(score);
      updateUserRecord(openid, this.data.scaleId, this.data.scaleTitle, score, score_1);
      wx.navigateTo({
        url: '/pages/evaResult/evaResult?id=' + this.data.scaleId + '&score=' + score + '&score_1=' + score_1
      });
    }
  },

  derivedScore: function (score) {
    let deScore;
    switch (this.data.scaleTitle) {
      case '焦虑自评量表（SAS）':
      case '抑郁自评量表（SDS）':
        deScore = Math.floor(1.25 * score);
        break;
      case '抑郁状态问卷（DSI）':
        deScore = (score / 80);
        break;
      default:
        deScore = score;
        break;
    };
    this.setData({
      score: deScore
    });
  },

  handleLsasClick_1: function (event) {
    const buttonIndex = event.currentTarget.dataset.index;
    this.setData({
      buttonIndex_1: buttonIndex,
    });
    this.checkLsasButtonClicks();
  },

  handleLsasClick_2: function (event) {
    const buttonIndex = event.currentTarget.dataset.index;
    this.setData({
      buttonIndex_2: buttonIndex,
    });
    this.checkLsasButtonClicks();
  },

  checkLsasButtonClicks: function () {
    const buttonIndex_1 = this.data.buttonIndex_1;
    const buttonIndex_2 = this.data.buttonIndex_2;
    let score = this.data.score;
    if (buttonIndex_1 !== null && buttonIndex_2 !== null) {
      score += (buttonIndex_1 + buttonIndex_2);
      this.setData({
        buttonIndex_1: null,
        buttonIndex_2: null,
        score: score
      });
      this.showNextItem();
    }
  },

  handleButtonClick: function (event) {
    const buttonIndex = event.currentTarget.dataset.index;
    const scaleTitle = this.data.scaleTitle;
    const currentIndex = this.data.currentItemIndex;
    const items = this.data.items;
    const isReverse = items[currentIndex - 1].reverse;
    let score = this.data.score;
    let score_1 = this.data.score_1;

    switch (this.data.currentQuestionType) {
      case 'two':
        if (isReverse) {
          score += buttonIndex
        } else {
          score += (1 - buttonIndex)
        };
        break;
      case 'three':
        if (currentIndex === 1 || currentIndex === 2 || currentIndex === 5 || currentIndex === 6 || currentIndex === 8 || currentIndex === 10) {
          score += buttonIndex;
        } else {
          score_1 += buttonIndex;
        };        
        break;
      case 'likert-4':
        if (scaleTitle === '抑郁状态问卷（DSI）' || scaleTitle === '焦虑自评量表（SAS）' || scaleTitle === '抑郁自评量表（SDS）') {
          if (isReverse) {
            score += (5 - buttonIndex);
          } else {
            score += (buttonIndex + 1);
          }
        } else {
          if (isReverse) {
            score += (4 - buttonIndex);
          } else {
            score += buttonIndex;
          }
        };
        break;
      case 'likert-5':
        if (scaleTitle === '状态与特质性孤独量表') {
          if (currentIndex < 12) {
            if (isReverse) {
              score += (6 - buttonIndex)
            } else {
              score += (buttonIndex + 1)
            }
          } else {
            if (isReverse) {
              score_1 += (6 - buttonIndex)
            } else {
              score_1 += (buttonIndex + 1)
            }
          }
        } else {
          if (isReverse) {
            score += (6 - buttonIndex)
          } else {
            score += (buttonIndex + 1)
          }
        };
        break;
      default:
        console.error('未知问题类型');
        break;
    };
    this.setData({
      score: score,
      score_1: score_1
    });
    this.showNextItem();
  },
});

async function updateUserRecord(openid, scaleId, scaleTitle, score, score_1) {
  try {
    const userCollection = db.collection('user');
    const userRecord = await userCollection.where({
      _openid: openid
    }).get();
    if (userRecord.data.length > 0) {
      const userData = userRecord.data[0];
      const scaleIndex = userData.evaData.findIndex(item => item.scaleId === scaleId);
      if (scaleIndex !== -1) {
        // 如果存在，则将新的分数数据追加到该记录的 scoreList 数组中
        if (scaleTitle === '状态与特质性孤独量表'  || scaleTitle === '儿童社交焦虑量表（SASC）') {
          userData.evaData[scaleIndex].scoreList.push({
            time: new Date(),
            score: score,
            score_1: score_1
          });
        } else {
          userData.evaData[scaleIndex].scoreList.push({
            time: new Date(),
            score: score
          });
        }
      } else {
        // 如果不存在，则创建一个新的记录
        if (scaleTitle === '状态与特质性孤独量表' || scaleTitle === '儿童社交焦虑量表（SASC）') {
          userData.evaData.push({
            scaleId: scaleId,
            scaleTitle: scaleTitle,
            scoreList: [{
              time: new Date(),
              score: score,
              score_1: score_1
            }]
          });
        } else {
          userData.evaData.push({
            scaleId: scaleId,
            scaleTitle: scaleTitle,
            scoreList: [{
              time: new Date(),
              score: score
            }]
          });
        }
      }
      // 更新数据库中的用户数据记录
      await userCollection.doc(userData._id).update({
        data: {
          evaData: userData.evaData
        }
      });
    } else {
      console.error('未找到用户数据记录');
    }
  } catch (error) {
    console.error('更新用户记录时出错：', error);
  }
}