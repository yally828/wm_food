// miniprogram/pages/evaluate/evaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    userInfo:{},
    // 未评价菜单
    notData:[],
    length:0,
    // 已评价菜单
    doneData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if(options.userInfo != undefined){
      this.setData({
        userInfo : JSON.parse(options.userInfo)
      })
    }

    setTimeout(()=>{
      this.setData({
        loading:false,
      })
      this.getNotAssess();
      this.getAssess();
    },1000)
    
  },

  // 查询未评价订单
  getNotAssess(){
    // 查询所有订单
    wx.cloud.callFunction({
      name:'get_order',
      success:res=>{
       
        for(let key in res.result.data){
          if(!res.result.data[key].isEvalute){
            this.data.notData.push(res.result.data[key])
          }
        }
        this.setData({
          notData:this.data.notData
        })
        // console.log("aaa",this.data.notData)

      },
      fail:err=>{}
    })
  },
  // 跳转写评价
  onWrite(e){
    let data = e.currentTarget.dataset.msg;
    // console.log("aaa",data)
    wx.navigateTo({
      url:`../writeReviews/writeReviews?data=${JSON.stringify(data)}&userInfo=${JSON.stringify(this.data.userInfo)}`
    })
  },
  // 获取评价信息
  getAssess(){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:'get_assess',
      success:res=>{
        wx.hideLoading()
        this.setData({
          length:res.result.data.length,
          doneData:res.result.data
        })
      },
      fail:err=>{
        wx.hideLoading()
      }
    })
  },
  
 
  
})