// 云函数入口文件
const cloud = require('wx-server-sdk');


cloud.init();

exports.main = async (event, context) => {
  const db = cloud.database();
  const scaleId = event.scaleId;
  const score = event.score;
  const score_1 = event.score_1;
  const totalScore = score + score_1;

  try {
    const res = await db.collection('scale').doc(scaleId).get();
    const title = res.data.title;

    switch (title) {
      case '状态与特质性孤独量表':
        return [score < 30 ? 0 : 1, score_1 < 30 ? 0 : 1];
      case '社交焦虑量表（LSAS）':
        if (score < 38) return 0;
        if (score < 52) return 1;
        if (score < 82) return 2;
        return 3;
      case '儿童社交焦虑量表（SASC）':
        return totalScore <= 9.05 ? 0 : 1;
      case '广泛性焦虑量表（GAD-7）':
        if (score < 5) return 0;
        if (score < 10) return 1;
        if (score < 14) return 2;
        if (score < 19) return 3;
        return 4;
      case '交往焦虑量表（IAS）':
        if (score < 29.2) return 0;
        if (score <= 48.6) return 1;
        return 2;
      case 'Sarason 考试焦虑量表(TAS)':
        if (score < 12) return 0;
        if (score < 20) return 1;
        return 2;
      case '焦虑自评量表（SAS）':
        if (score < 50) return 0;
        if (score < 60) return 1;
        if (score < 70) return 2;
        return 3;
      case '贝克抑郁问卷(BDI)':
        if (score < 5) return 0;
        if (score < 8) return 1;
        if (score < 16) return 2;
        return 3;
      case '抑郁状态问卷（DSI）':
        if (score < 0.5) return 0;
        if (score < 0.6) return 1;
        if (score < 0.7) return 2;
        return 3;
      case '9条目患者健康问卷(PHQ-9)':
        if (score < 5) return 0;
        if (score < 10) return 1;
        if (score < 15) return 2;
        return 3;
      case '爱丁堡产后抑郁量表(EPDS)':
        return score < 12 ? 0 : 1;
      case '老年抑郁量表(GDS)':
        if (score < 11) return 0;
        if (score < 21) return 1;
        return 2;
      case '流调用抑郁自评量表(CES-D)':
        if (score < 15) return 0;
        if (score < 21) return 1;
        return 2;
      case '双相情感障碍自评量表（BSQ）':
        if (score < 16) return 0;
        if (score < 25) return 1;
        return 2;
      case '抑郁自评量表（SDS）':
        if (score < 53) return 0;
        if (score < 63) return 1;
        if (score < 73) return 2;
        return 3;
      default:
        console.error('无法识别的量表！');
        return -1;
    }    
  } catch (err) {
    console.error('分段判断失败', err);
    return {
      err
    };
  }
}