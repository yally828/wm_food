// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // return await db.collection('food_products').where({type:event.type}).get()
  return await db.collection('food_products').where({[event.key]:event.value}).get()

  

}