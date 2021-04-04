// miniprogram/pages/editAddress/editAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    _id:'',
    addressInfo:{
      receiver:'',
      phone:'',
      area:'请选择地区',
      detail:'',
      isDefault:false,
    },
    copyAddressInfo:{},
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
    
    this.setData({
      _id:options._id,
    })
    this.getAddressById()
   

  },
  // 文本数据
  changeIptText(e){
    let key = e.target.dataset.key;
    this.data.addressInfo[key] = e.detail.value;
    this.setData({
      addressInfo:this.data.addressInfo
    })
  },
  // 查询某条数据库 get_address_by_key
  getAddressById(){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    wx.cloud.callFunction({
      name:'get_address_by_key',
      data:{
        key:'_id',
        value:this.data._id
      },
      success:res=>{
        wx.hideLoading()
        let addressInfo = this.data.addressInfo;
        for(let key in addressInfo){
          addressInfo[key] = res.result.data[0][key];
          this.data.copyAddressInfo[key] = res.result.data[0][key];
        }
        this.setData({
          addressInfo
        })
      },
      fail:err=>{
        wx.hideLoading()
        wx.showToast({
          title: '查询失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 删除地址 delete_address
  deleteAddress(){
    wx.cloud.callFunction({
      name:'delete_address',
      data:{
        _id:this.data._id
      },
      success:res=>{
        if(res.result.stats.removed == 1){
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 2000
          })
          wx.navigateTo({
            url: '../pay/pay',
          })
        }
      },
      fail:err=>{
        wx.showToast({
          title: '删除失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 提交地址
  commit(){
  
    let editAddressInfo = {}
    for(let key in this.data.addressInfo){
      if(key == 'area'){
        let area = this.data.addressInfo[key].join('');
        let areaCopy = this.data.copyAddressInfo[key].join('');
        if(area != areaCopy){
          editAddressInfo[key] = this.data.addressInfo[key]
        }
        continue;
      }
      if(this.data.addressInfo[key] != this.data.copyAddressInfo[key]){
        // 判断是否有为默认地址
        if(key == 'isDefault' && this.data.addressInfo[key]){
          // 查询地址是否为默认地址
          this.findAddress();
        }
        editAddressInfo[key] = this.data.addressInfo[key];
        break;
      }
    }

    if(JSON.stringify(editAddressInfo) == '{}'){
      wx.navigateTo({
        url: '../pay/pay',
      })
    }else{
      // 更新地址
      this.editAddress(this.data._id,editAddressInfo)
    }
    

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
        console.log("查询是否默认地址",res)
        wx.hideLoading();
        if(res.result.data.length > 0 ){
          // 修改该地址为非默认地址

          let _id = res.result.data[0]._id

          // 编辑地址 修改原默认地址为非默认地址
          this.editAddress(_id,{
            isDefault:false,
          });
        }
        
      },
      fail:err=>{
        wx.hideLoading();
      }
    })
  },
   // 更新地址
   editAddress(_id,data){
    wx.cloud.callFunction({
      name:'update_address_by_id',
      data:{
        _id:_id,
        // 更新的数据
        data:data
      },
      success:res=>{
        if(res.result.stats.updated == 1){
          // 成功更新
          wx.showToast({
            title: '编辑成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateTo({
            url: '../pay/pay',
          })
        }
      },
      fail:err=>{
        wx.showToast({
          title: '编辑失败',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

})