// miniprogram/pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    tab:['全部订单','待完成','已完成'],
    tabIndex:0,
    orderData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(()=>{
      this.setData({
        loading:false
      })
    },500)
    // 获取订单数据
    this.getOrderData()
  },
  // tab栏点击
  onTab(event){
    let key  = event.currentTarget.dataset.key
    if(key == this.data.tabIndex){
      return
    }
    this.setData({
      tabIndex : key
    })
    // 获取订单数据
    this.getOrderData()
     
  },
  // 获取订单数据
  getOrderData(){
    let key = this.data.tabIndex
    // console.log("索引值key",key)
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'get_order',
      success:res=>{
        wx.hideLoading()
        let data = [];
        // 有订单
        if(res.result.data){
          for(let i = 0;i<res.result.data.length;i++){
            if(key == 0){
              // 全部 ==0
              data = res.result.data
            }else{
              // 待完成 == 1 已完成 == 2
              if(res.result.data[i].status == key){
                data.push(res.result.data[i])
              }
            }
          }
        }else{
          wx.showToast({
            title: '暂无订单数据',
            icon:"none",
            duration:1000
          })
        }
        if(data.length == 0){
          wx.showToast({
            title: '暂无订单数据',
            icon:"none",
            duration:1000
          })
        }
        // console.log("key ==",key,"data==",data)
        this.setData({
          orderData:data
        })
      },
      fail:err=>{
        wx.hideLoading();
        wx.showToast({
          title: '加载失败',
          icon:'none',
          duration:1000
        })
      }
    })
  }
  
  
})