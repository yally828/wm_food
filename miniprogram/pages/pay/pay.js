// miniprogram/pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAddressShow:true,
    addressInfo:[],
    nowAddressInfo:{},
    isHidden:true,
    take:["外卖配送","到店自取"],
    takeIndex:0,
    isBool:true,
    loading:true,
    // 订单数据
    payData:[],
    // 总价
    totalPrice:0,
    // 总数量
    totalCount:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPayData(options)
    setTimeout(()=>{
      this.setData({
        loading:false
      })
    },1000)
    
  },

  // 隐藏收货地址弹窗
  onHideAddress(){
      this.setData({
        isAddressShow:true,
      })
  },
  // 显示收货地址弹窗
  onShowAddress(){
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    this.setData({
      isAddressShow:false,
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
  // 当前选择的收货地址
  onNowAddress(event){
    this.setData({
      nowAddressInfo:event.detail,
      isBool:false
    })

  },
  // 选择提取方式
  onTake(event){
    let i = event.currentTarget.dataset.i;
    if(this.data.takeIndex == i){
      return
    }
    let isHidden = true;
    if(i == 1){
        isHidden = false
    }else{
        isHidden = true
    }

    this.setData({
      takeIndex : i,
      isHidden:isHidden
    })

  },

  // 提交订单
  commit(){
    // 订单信息
    let result = {}
    // status : 1-- 待完成 2-- 已完成
    result= {
      payData:this.data.payData,
      address:{},
      totalCount:this.data.totalCount,
      totalPrice:this.data.totalPrice,
      status:1,isEvalute:false,
    };
    if(this.data.isHidden){
      // 外卖配送 必须填写地址
      if(this.data.isBool){
        // 未填写地址
        wx.showToast({
          title: '请选填地址',
          icon:'none',
          duration:1000,
        })
        return;
      }else{
        // 已填写地址
        // console.log("已填写地址 commit");
        // 获取地址信息
        let address={
          area : '',
          detail: '',
          receiver : '',
          phone : ''
        }
        for(let key in this.data.nowAddressInfo){
          address[key] = this.data.nowAddressInfo[key]
        }
        result.address = address;
        this.createOrder(result)
      }
    }else{
        // 到店自取 无需填写地址
        // console.log("到店自取 commit");
        this.createOrder(result)
    }
  },
  // 生成订单数据库
  createOrder(data){
    wx.showLoading({
      title: '正在提交',
    })
    wx.cloud.callFunction({
      name:'add_order',
      data:data,
      success:res=>{
        wx.hideToast();
        wx.showToast({
          title: '提交订单成功',
          icon:'none',
          duration:1000
        })
        // console.log("订单提交",data.payData)
        // 跳转到订单页面
        wx.switchTab({
          url: '../order/order',
        })
        for(let i = 0;i<data.payData.length;i++){
          // 修改订单的月销量/好评率
          this.changeSale(data.payData[i].pid, {
            key:'salesVolume',
            value:data.payData[i].proCount
          })
        }
        // 清空购物车
        this.clearShopcart()
      },
      fail:err=>{
        wx.hideToast();
        wx.showToast({
          title: '提交订单失败',
          icon:'none',
          duration:1000
        })
      }
    })
  },
  // 获取购物车数据
  getPayData(option){
    wx.showLoading({
      title: '加载中',
    }),
    wx.cloud.callFunction({
    name:'get_shopcart',
    success:res=>{
      wx.hideLoading()
      this.setData({
        totalPrice:option.totalPrice,
        totalCount:option.totalCount,
        payData:res.result.data
      })
      console.log("查找购物车data",this.data.payData)
    }
  })
  },
  // 清空购物车
  clearShopcart(){
    wx.cloud.callFunction({
      name:'delete_shopcart_by_id',
      data:{key:'isCart',value:true},
      success:res=>{},
      fail:err=>{}
    })
  },
  // 修改订单的月销量/好评率
  changeSale(_id,o){
    console.log("aaa",_id)
    wx.cloud.callFunction({
      name:'update_menu_product',
      data:{
        _id,
        key:o.key,
        value:o.value
      },
      success:res=>{
      //  console.log(res.result.stats.updated)
       if(res.result.stats.updated == 1){
          // 获取菜单列表 get_menu_list
          // this.getMenuList()
          console.log("更新成功")
       }
      },
      fail:err=>{}
    })
  },


})