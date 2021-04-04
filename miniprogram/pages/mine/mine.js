// miniprogram/pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:[
      {
        title:'地址管理',
        url:'../address/address'
      },
      {
        title:'我的足迹',
        url:'../footprint/footprint'
      },
      {
        title:'我的评价',
        url:'../evaluate/evaluate'
      },
    ],
    canIUse: wx.canIUse('button.open-type.getUserInfo'), // 这个是兼容
    userInfo:{
      nickName:'',
      avatarUrl:''
    },
    loading:true
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setTimeout(()=>{
      this.setData({
        loading:false
      })
      this.getUserInfo()
   
    },1000)
  },
  // 跳转
  toPage(event){
    let url = event.currentTarget.dataset.url
    wx.navigateTo({
      // url:url?'userInfo'=this.data.userInfo,
      url:url+'?userInfo='+JSON.stringify(this.data.userInfo)
    })
  },
  // 获取头像
  getUserInfo(){
    let that = this
    // 查看是否授权
    wx.getUserInfo({
      success (res){
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        that.setData({
          [avatarUrl]: res.userInfo.avatarUrl,
          [nickName]:res.userInfo.nickName,
        })
      }
    })
  },
  
  
})