// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  return db.collection('food_shopcart_data').where({
    _id:event._id,
  }).update({
    data:{
      'proCount':event.proCount
    }
  })
}