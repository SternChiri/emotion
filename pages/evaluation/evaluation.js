// pages/evaluation.js
const db = wx.cloud.database();

Page({
  data: {
    searchResult: [],
    scaleList: [],
    tags: ['全部'],
    selectedTag: '全部',
    backgroundColorMap: {
      '抑郁': '#FFB6C1',
      '焦虑': '#87CEFA',
      '社交': '#FFA500',
      '孤独': '#9370DB',
      '双相': '#00CED1',
      '儿童': '#90EE90',
      '患者': '#90EE90',
      '老年': '#90EE90',
      '考试': '#FA8072',
      '产后': '#FA8072',
    }
  },
  onLoad: function () {
    db.collection('scale').get({
      success: res => {
        const searchResult = res.data;
        const tagCountMap = {};
        searchResult.forEach(item => {
          item.tag.forEach(tag => {
            tagCountMap[tag] = (tagCountMap[tag] || 0) + 1;
          });
        });
        const tagCountArray = Object.entries(tagCountMap);
        tagCountArray.sort((a, b) => b[1] - a[1]);
        const tags = tagCountArray.map(entry => entry[0]);
        this.setData({
          searchResult: res.data,
          scaleList: searchResult,
          tags: ['全部', ...tags]
        });
        this.filterListByTag('全部');
      },
      fail: err => {
        console.error('拉取内容失败：', err);
      }
    });
  },

  onInputChange: function (event) {
    const searchText = event.detail.value;
    this.setData({
      noResultMessage: ''
    });
    db.collection('scale').where({
      title: db.RegExp({
        regexp: searchText,
        options: 'i'
      })
    }).get().then(res => {
      if (res.data.length > 0) {
        this.setData({
          searchResult: res.data
        });
      } else {
        this.setData({
          searchResult: [], 
          noResultMessage: '没有找到你想找的内容哦~请换个词试试！'
        });
      }
    }).catch(err => {
      console.error('搜索失败：', err);
    });
  },

  // 用户选择类别时触发的事件处理程序
  onTagChange: function (event) {
    const selectedTagIndex = event.detail.value;
    const selectedTag = this.data.tags[selectedTagIndex];
    this.setData({
      selectedTag: selectedTag
    });
    this.filterListByTag(selectedTag);
  },

  // 根据标签筛选列表
  filterListByTag: function (selectedTag) {
    if (selectedTag === '全部') {
      this.setData({
        searchResult: this.data.scaleList
      });
    } else {
      db.collection('scale').where({
        tag: selectedTag
      }).get().then(res => {
        this.setData({
          searchResult: res.data
        });
      }).catch(err => {
        console.error('数据库请求失败：', err); // 输出数据库请求失败的错误信息
      });
    }
  }
});