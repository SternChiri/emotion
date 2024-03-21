// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const openid = cloud.getWXContext().OPENID;

    // 获取用户的 diary 数组，按时间从新到旧排列
    const res = await db.collection('user')
      .where({
        _openid: openid
      })
      .field({
        diary: true
      })
      .get()

    if (res.data.length > 0 && res.data[0].diary) {
      const diaryList = res.data[0].diary.reverse(); // 将 diary 数组倒序排列
      return {
        diaryList: diaryList
      };
    } else {
      return {
        diaryList: [] // 如果没有 diary 数组，返回空数组
      };
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}