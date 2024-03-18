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
    currentItemIndex: 0,
    currentQuestion: {},
    isInstruction: false,
    items: [],
    currentQuestionType: '',
    buttonIndex_1: null,
    buttonIndex_2: null,
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
          items: scaleData.items
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
      wx.navigateTo({
        url: '/pages/evaResult/evaResult?id=' + this.data.scaleId
      });
    }
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
    if (buttonIndex_1 !== null && buttonIndex_2 !== null) {
      console.log("Button index clicked from source 1:", buttonIndex_1);
      console.log("Button index clicked from source 2:", buttonIndex_2);
      this.setData({
        buttonIndex_1: null,
        buttonIndex_2: null
      });
      this.showNextItem();
    }
  },

  handleButtonClick: function (event) {
    // 获取按钮在列表中的索引
    const buttonIndex = event.currentTarget.dataset.index;
    console.log(event.currentTarget.dataset.index)
    // 根据按钮索引和当前问题类型执行相应操作
    switch (this.data.currentQuestionType) {
      case 'two':
        // 根据按钮索引执行不同的操作
        if (buttonIndex === 0) {
          // 左边按钮逻辑
        } else if (buttonIndex === 1) {
          // 右边按钮逻辑
        }
        break;
      case 'three':
        // 三个按钮逻辑
        break;
      case 'likert-4':
        // likert-4 类型按钮逻辑
        break;
      case 'likert-5':
        // likert-5 类型按钮逻辑
        break;
      default:
        console.error('未知问题类型');
        break;
    };
    this.showNextItem();
  },
});