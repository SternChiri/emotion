const cloud = require('wx-server-sdk')
cloud.init({
  env: 'emotion-7gazfr5v6f07338a'
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const res = await db.collection('meditation').get()
    return res.data
  } catch (err) {
    console.error('获取音乐数据失败：', err)
    throw err
  }
}
