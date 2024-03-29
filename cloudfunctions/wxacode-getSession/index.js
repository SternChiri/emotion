// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

exports.main = async (event, context) => {
  let {
    OPENID
  } = cloud.getWXContext();

  try {
    const db = cloud.database();
    // 查询是否已存在相同 openid 的记录
    const queryResult = await db.collection('user').where({
      _openid: OPENID
    }).get();
    // 如果存在相同 openid 的记录，则不需要创建新记录
    if (queryResult.data.length > 0) {
      return {
        openid: queryResult.data[0]._openid
      };
    } else {
      // 不存在相同 openid 的记录，则创建新记录
      const result = await db.collection('user').add({
        data: {
          _openid: OPENID,
          evaData: [],
          adjData: [],
          diary: []
        }
      });
      return {
        openid: result._openid
      };
    }
  } catch (err) {
    console.error('openid写入数据库失败', err);
    return {
      err
    };
  }
}