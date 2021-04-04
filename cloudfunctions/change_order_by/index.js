// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

let db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('food_order_data').where({_id:event._id}).update({
    data:{
      [event.key]:event.value
    }
  })
}