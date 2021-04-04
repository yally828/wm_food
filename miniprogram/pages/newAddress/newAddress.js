// miniprogram/pages/newAddress/newAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,

    addressInfo:{
      receiver:'',
      phone:'',
      area:'请选择地区',
      detail:'',
      isDefault:false,
      url: '../pay/pay',

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    setTimeout(()=>{
      this.setData({
        loading:false
      })
    },1000)
    console.log(options.url)
    if(options.url == 'newAddress'){
      this.setData({
        url:'../address/address'
      })
    }
  
  },
  // 文本数据
  changeIptText(e){
    let key = e.target.dataset.key;
    this.data.addressInfo[key] = e.detail.value;
    this.setData({
      addressInfo:this.data.addressInfo
    })
  },
  // 提交数据
  commit(){
    // 验证表单是否填写
    let addressInfo = this.data.addressInfo;
    for(let key in addressInfo){
      if(addressInfo[key] === ' ' || addressInfo[key] == '选择地区'){
        wx.showToast({
          title: '请填写地址信息',
          icon: 'none',
          duration: 2000,
          mask:true
        })
        return;
      }
    }
    // 验证手机号码
    if(!/^1[3-9]\d{9}$/.test(addressInfo.phone)){
      wx.showToast({
        title: '手机号码格式不正确',
        icon: 'none',
        duration: 2000,
        mask:true
      })
      return;
    }
    // 如果存在默认地址，则改为非默认
    if(addressInfo.isDefault){
      this.findAddress()
    }else{
      // 新增地址
      this.addAddress()
    }
   
  },
  // 新增地址
  addAddress(){
    // 成功
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    // 存储到数据库 add_address
    wx.cloud.callFunction({
      name:'add_address',
      data:this.data.addressInfo,
      success:res=>{
        wx.hideLoading();
        if(res.result._id){
          wx.showToast({
            title: '新增地址成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateTo({
            // url: '../pay/pay',
            url:this.data.url
          })
        }else{
          wx.showToast({
            title: '新增地址失败',
            icon: 'none',
            duration: 2000,
            mask:true
          })
        }
      },
      fail:err=>{
      }
    })
  },
  // 查询地址是否为默认地址
  findAddress(){
    // 成功
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    wx.cloud.callFunction({
      name:'get_address_by_key',
      data:{
        key:'isDefault',
        value:true
      },
      success:res=>{

        wx.hideLoading();
        if(res.result.data.length > 0 ){
          // 修改该地址为非默认地址

          // 获取该地址的_id
          let _id = res.result.data[0]._id
          // 编辑地址
          this.editAddress(_id);
        }
        else{
          //新增地址
          this.addAddress(this.data.addressInfo)
        }
      },
      fail:err=>{
        wx.hideLoading();
      }
    })
  },
  // 编辑地址
  editAddress(_id){
    wx.cloud.callFunction({
      name:'update_address_by_id',
      data:{
        _id,
        // 更新的数据
        data:{
          isDefault:false
        }
      },
      success:res=>{

        if(res.result.stats.updated == 1){
          // 成功更新
          this.addAddress();
        }
        
      },
      fail:err=>{
      }
    })
  },
  
})