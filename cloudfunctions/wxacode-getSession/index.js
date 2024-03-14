// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

exports.main = async (event, context) => {
  let {
    OPENID,
    APPID,
    UNIONID
  } = cloud.getWXContext();
  
  try {
    const db = cloud.database();
    // 查询是否已存在相同 openid 的记录
    const queryResult = await db.collection('user').where({
      openid: OPENID
    }).get();
    // 如果存在相同 openid 的记录，则不需要创建新记录
    if (queryResult.data && queryResult.data.length > 0) {
      return { result: '用户已存在' };
    } else {
      // 不存在相同 openid 的记录，则创建新记录
      const result = await db.collection('user').add({
        data: {
          openid: OPENID
        }
      });
      return { result: '新用户登录，信息已写入数据库！' };
    }
  } catch (err) {
    console.error('openid写入数据库失败', err);
    return { err };
  }
}
