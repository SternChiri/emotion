// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 获取数据库引用
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { data } = event; 

  try {
    const openid = cloud.getWXContext().OPENID;
    const currentTime = new Date();
    data.time = currentTime;
    
    // 在 user 集合中查找并更新对应 openid 的记录，如果不存在则新建一条记录
    const result = await db.collection('user').where({
      _openid: openid
    }).update({
      data: {
        // 使用 $push 操作符将数据追加到 adjData 数组中
        adjData: db.command.push(data)
      }
    });

    return {
      success: true,
      message: '数据保存成功'
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: '数据保存失败'
    };
  }
}
