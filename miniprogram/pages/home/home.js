// miniprogram/pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 菜单列表数据
    asideMenuList:[],
    // 菜单列表激活索引
    asideIndex:0,
    // 菜单
    products:[]

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMenuList();
    this.getMenuProducts('zj');
  },
  // 获取菜单列表 get_menu_list
  getMenuList(){
    wx.cloud.callFunction({
      name:"get_menu_list",
      success:res=>{
        this.setData({
          asideMenuList:res.result.data
        })
      },
      fail:err=>{
        console.log("获取菜单列表 err",err)
      }
    })
  },
  // 侧边栏列表点击
  asideClick(e){
    let index  = e.currentTarget.dataset.index;
    if(index == this.data.asideIndex){
      return;
    }
    this.setData({
      asideIndex:index
    })
    
  },
  // 获取菜单
  getMenuProducts(type){
    wx.cloud.callFunction({
      name:'get_menu_products',
      data:{
        type
      },
      success:res=>{
        console.log("获取菜单 res==>",res.result.data)
        this.setData({
          products:res.result.data
        })
      },
      fail:err=>{
        console.log("获取菜单 err=>",err)
      }
    })
  }

 
})