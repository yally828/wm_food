// miniprogram/pages/writeReviews/writeReviews.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    // 
    writeData:{},
    // 是否有内容
    isCon:false,
    serveBtnData:[
      {
        name:'不满意',
        src:'../../images/bed.png',
        aSrc:'../../images/a-bed.png',
        index:0,
        aIndex:-2,
      },
      {
        name:'满意',
        src:'../../images/nice.png',
        aSrc:'../../images/a-nice.png',
        index:1,
        aIndex:-2,
      },
    ],
    star:[
      {src:"../../images/star.png",aSrc:"../../images/a-star.png",index:1},
      {src:"../../images/star.png",aSrc:"../../images/a-star.png",index:2},
      {src:"../../images/star.png",aSrc:"../../images/a-star.png",index:3},
      {src:"../../images/star.png",aSrc:"../../images/a-star.png",index:4},
      {src:"../../images/star.png",aSrc:"../../images/a-star.png",index:5},
    ],
    currentStar:-1,
    assess:{
      msg:{},
      time:'',
      tasteRank:0,
      serveRank:''
    },
    userInfo:{},
    serveRank:'',
    // 是否匿名
    isHideName:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    setTimeout(()=>{
      this.setData({
        loading:false,
        writeData:JSON.parse(options.data),
        userInfo:JSON.parse(options.userInfo)
      })
      console.log(this.data.userInfo)
     
    },1000)
   
  },

  // 商家服务切换 
  onChangeServe(e){
    let index = e.currentTarget.dataset.index;
    let data = this.data.serveBtnData;
   
    for(let i =0;i<data.length;i++){
      data[i].aIndex = -2;
      if(data[i].aIndex == index) return;
      data[index].aIndex = index;
    }

    this.setData({
      serveBtnData:data,
      isCon:true,
      serveRank:data[index].name
    })
  },
  // 点亮星星
  onStart(e){
    let index = e.currentTarget.dataset.index + 1;
    for(let i = 0;i<this.data.star.length;i++){
      this.data.star[i].src="../../images/star.png"
    }
    if(index == this.data.currentStar){
      this.data.currentStar = 0
      index = 0
    }
    if(index != this.data.currentStar){
      for(let i =0;i<index;i++){
        this.data.star[i].src = '../../images/a-star.png'
      }
    }
    this.setData({
      star:this.data.star,
      currentStar:index,
      isCon:true
    })
  },
  // 提交评价 提交时间 提交对象 口味 服务 商品信息
  commit(){
    // 提交信息
    let result ={
      data:this.data.writeData,
      time:this.getDate(),
      tasteRank:this.data.currentStar,
      serveRank:this.data.serveRank,
      userInfo:this.data.userInfo
    }
    wx.showLoading({
      title: '提交中',
    })
    wx.cloud.callFunction({
      name:'add_assess',
      data:result,
      success:res=>{
        wx.hideLoading()
        wx.showToast({
          title: '提交成功',
          icon:'none',
          duration:2000
        })
        // 修改状态
        this.changeStatus(this.data.writeData._id)
        // 修改好评率 this.data.writeData._id = 订单id this.data.currentStar=好评
        this.getAssess(this.data.writeData._id,this.data.currentStar)

        wx.redirectTo({
          url: '../evaluate/evaluate?userInfo'+{},
        })
      },
      fail:err=>{
        wx.hideLoading()
        wx.showToast({
          title: '提交失败',
          icon:'none',
          duration:2000
        })
      }
    })

  },
  // 获取时间
  getDate(){
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1;
    let date = currentDate.getDate();
  
    let time = `${year}年${month}月${date}日`
    return time
   
  },
  // 匿名提交
  onHideName(){
    this.setData({
      isHideName:!this.data.isHideName
    })
    
    if(this.data.isHideName){
      console.log("匿名")
      this.data.userInfo.isHideName = true
      this.setData({
        userInfo:this.data.userInfo
      })
    }
  },
  // 修改 未评价 -> 已评价
  changeStatus(_id){
    wx.cloud.callFunction({
      name:'change_order_by',
      data:{
        _id,
        key:'isEvalute',
        value:true
      },
      success:res=>{
        console.log("已评价 修改成功")
      }
    })
  },
  // 修改好评率

  // 获取评价数据
  getAssess(id,tasteRank){
    wx.cloud.callFunction({
     name:'get_order',
     success:res=>{
       // 订单
       let data = res.result.data;
       if(data){
        //  console.log(" 有评价 Data",data)
         for(let i = 0;i<data.length;i++){
          // console.log("获取每一商品订单id ",data[i]._id)
           if(data[i]._id == id){
             for(let key in data[i].payData){
              this.getProducts(data[i].payData[key].pid, tasteRank);
             }
           }
           }
         }
      },
     fail:err=>{
     }
   })
  },
 
  // 获取全部商品信息
  getProducts(pid,tasteRank){

     wx.cloud.callFunction({
       name:'get_menu_products',
       data:{
         key:'_id',
         value:pid
       },
       success:res=>{
      
         let rate = res.result.data[0].rate + tasteRank;
         this.changeSale(pid,rate)
       },
     })
  },
  // 修改订单的月销量/好评率
  changeSale(_id,rate){
     console.log(_id,rate)
     wx.cloud.callFunction({
       name:'update_menu_product',
       data:{
         _id,
         key:'rate',
         value:rate
       },
       success:res=>{
       //  console.log(res.result.stats.updated)
       if(res.result.stats.updated){
           // 获取菜单列表 get_menu_list
           // this.getMenuList()
           console.log("好评率修改成功")
       }
       },
       fail:err=>{}
     })
  },
 
  
})