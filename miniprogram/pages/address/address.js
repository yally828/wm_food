// miniprogram/pages/address/address.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressInfo:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取地址信息
    this.getAddressInfo()
  },
  // 获取地址信息
  getAddressInfo(){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
     // 获取收获地址
     wx.cloud.callFunction({
      name:'get_address',
      success:res=>{
        wx.hideLoading();
        this.setData({
          addressInfo:res.result.data
        })
      },
      fail:err=>{
      }
    })
  },
  // 跳转
  toNewAddress(){
    wx.navigateTo({
      url: '../newAddress/newAddress?url=newAddress',
    })
  },
  editAddress(event){
    wx.navigateTo({
      url: '../editAddress/editAddress?_id'+event.currentTarget.dataset._id,
    })
  }

  
})