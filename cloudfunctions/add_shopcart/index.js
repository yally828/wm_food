// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
let db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  
  let currentDate = new Date();
  let time = currentDate.getTime()
  // let year = currentDate.getFullYear();
  // let month = currentDate.getMonth() + 1;
  // let date = currentDate.getDate();
  // let hours = currentDate.getHours();
  // let minutes = currentDate.getMinutes();
  // let seconds = currentDate.getSeconds();
  // let time = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`

  event.time = time;
  
  return await db.collection('food_shopcart_data').add({
    data:event
  })
 
}