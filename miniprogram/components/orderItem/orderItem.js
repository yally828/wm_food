// components/orderItem/orderItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    orderData:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 订单状态
    onChangeStatus(event){
      let status =  event.currentTarget.dataset.status;
      if(status == "2"){
        wx.showToast({
          title: '订单已完成',
          icon: 'none',
          duration: 2000
        })
        return;
        
      }else if(status == "1"){
        let _id = event.currentTarget.dataset.key;
        // 修改订单状态 ==> 已完成
        this.changeOrderStatus(_id,2);
       
      }

    },
    // 删除订单
    deleteOrder(e){
      let _id = e.currentTarget.dataset.id;
      let status = e.currentTarget.dataset.status;
      
      if(status == 1){
        wx.showToast({
          title: '订单未完成，无法删除订单',
          icon: 'none',
          duration: 2000
        })
        return;
      }
      wx.cloud.callFunction({
        name:'delete_order_by',
        data:{
          _id
        },
        success:res=>{
          // console.log(res.result)
          if(res.result.stats.removed == 1){
            wx.showToast({
              title: '删除订单成功',
              none:'none',
              duration:2000
            })
            // 重新渲染页面
            this.triggerEvent("getOrderData")
          }
        },
        fail:err=>{
          wx.showToast({
            title: '删除订单失败',
            icon:'none',
            duration:2000
          })
        }
      })
    },
    //修改订单状态
    changeOrderStatus(_id,status){
      // console.log("修改订单状态",_id,status)
      wx.showToast({
        title: '订单状态修改中',
        icon:"none",
        duration:2000
      })
      wx.cloud.callFunction({
        name:'change_order_by',
        data:{
          _id:_id,
          key:'status',
          value:status
        },
        success:res=>{
          if(res.result.stats.updated == 1){
            wx.showToast({
              title: '订单状态修改成功',
              icon:"none",
              duration:2000
            })
            // 重新渲染页面
            this.triggerEvent("getOrderData")
          }
        },
        fail:err=>{
          wx.showToast({
            title: '订单完成失败',
            icon:'none',
            duration:1000
          })
        }
      })
    }

  }
})
