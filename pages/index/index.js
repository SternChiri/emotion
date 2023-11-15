// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    todayDate: getTodayDate(),
  },
  goToDetailPage() {
    // 处理点击“查看详情”按钮的逻辑
    wx.navigateTo({
      url: '/pages/detail/detail',
    });
  },

  showModal() {
    wx.showModal({
      title: '关于心理健康',
      content: '心理健康是指人们在心理上的良好状态，包括积极的情感、稳定的情绪、健康的人格和良好的心理适应能力。心理健康对于人们的生活和工作都有着重要的影响，因此，我们应该重视心理健康问题。首先，心理健康对于个人的身心健康都有着重要的影响。心理健康不仅可以提高人们的免疫力，还可以预防和治疗许多疾病，如抑郁症、焦虑症、心理障碍等。此外，心理健康还可以提高人们的生活质量，使人们更加乐观、自信、积极向上。其次，心理健康对于社会的稳定和发展也有着重要的作用。心理健康的人们更容易与他人和睦相处，建立良好的人际关系，从而促进社会的和谐与稳定。此外，心理健康的人们更加积极向上，更有创造力，能够为社会的发展做出更大的贡献。最后，我们应该重视心理健康问题，采取积极的措施来维护心理健康。例如，我们可以通过锻炼身体、保持良好的生活习惯、学习心理健康知识等方式来提高自己的心理健康水平。此外，我们还可以通过寻求专业的心理咨询和治疗来解决心理问题，保持心理健康。总之，心理健康对于人们的生活和工作都有着重要的影响，我们应该重视心理健康问题，采取积极的措施来维护自己的心理健康。',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
});

// 获取今天的日期，包括月、日、星期
function getTodayDate() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekDay = weekDays[now.getDay()];

  return `${month}月${day}日\n周${weekDay}`;
}

