// pages/evaluation.js
const db = wx.cloud.database();

Page({
  data: {
    searchResult: [],
    scaleList: [],
    tags: ['全部'],
    selectedTag: '全部'
  },
  onLoad: function () {
    db.collection('scale').get({
      success: res => {
        const searchResult = res.data;
        const tags = [...new Set(searchResult.map(item => item.tag))];
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
    db.collection('scale').where({
      title: db.RegExp({
        regexp: searchText,
        options: 'i'
      })
    }).get().then(res => {
      this.setData({
        searchResult: res.data
      });
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