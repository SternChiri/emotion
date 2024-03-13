// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

exports.main = async (event, context) => {
  let {
    OPENID,
    APPID,
    UNIONID
  } = cloud.getWXContext()
  try {
    const db = cloud.database();
    const result = await db.collection('user').add({
      data: {
        openid: OPENID
      }
    });

    return {
      result
    };
  } catch (err) {
    console.error('openid写入数据库失败', err);
    return {
      err
    };
  }
}