// components/cartPopup/cartPopup.js
Component({
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.setData({
        shopData:this.properties.shopData
      })
    },
  },
  /**
   * 组件的属性列表
   */
  properties: {
    shopData:{
      type:Array,
      value:[]
    },
    // 商品入购数量
    proCount:{
      type:Number,
      value:1
    },
    // 购物车总价
    totalPrice:{
      type:Number,
      value:0,
    },
    // 购物车总数量
    totalCount:{
      type:Number,
      value:0,
    }
  
  },

  /**
   * 组件的初始数据
   */
  data: {
    proCount:1,
    shopData:[],
    // 购物车总价
    totalPrice:0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onRule(){
      this.triggerEvent('onRule',{type:'isCartShow',show:true})
    },
    // 跳转结算页面
    toPay(){
      wx.navigateTo({
        url:`../../pages/pay/pay?totalPrice=${this.data.totalPrice}&totalCount=${this.properties.totalCount}`

      })
      setTimeout(()=>{
        // 关闭弹窗
        this.onRule()
      },1000)
    },
   
    // 数量增加
    onUpNum(e){
      let proCount = e.currentTarget.dataset.proCount
      let _id = e.currentTarget.dataset._id;

      proCount ++;

      // 更改数据库商品数量
      this.updateCount(_id,proCount)
    },
    // 数量减少
    onDownNum(e){
      let proCount = e.currentTarget.dataset.proCount
      let _id = e.currentTarget.dataset._id
      if(proCount <= 1){
        // 删除记录
        this.deleteCount({key:'_id',value:_id});
        return;
      }
      proCount --;
       // 更改数据库商品数量
       this.updateCount(_id,proCount);
    },
    // 更改数据库商品数量
    updateCount(_id,proCount){
      wx.cloud.callFunction({
        name:'update_shopcart_by',
        data:{
          _id,
          proCount,
        },
        success:res=>{
          // 查找购物车数量
          this.getShopCartCount();
          // 查重新渲染商品数量
          this.getCount(_id)
        },
        fail:err=>{
          wx.showToast({
            title: '添加数量失败',
            icon:none,
            duration:2000
          })
        }
      })
    },
    // 查找购物车数量
    getShopCartCount(){
      wx.cloud.callFunction({
        name:'get_shopcart',
        success:res=>{
          let totalCount = 0;
          let totalPrice = 0;
          let price = 0
          let data = res.result.data;
          for(let i =0;i<data.length;i++){
            totalCount += data[i].proCount
            price = data[i].proCount *10 * data[i].price * 10 / 100
            totalPrice = (totalPrice * 10 + price * 10)  / 10
          }
          
          this.setData({
            totalPrice:totalPrice,
            totalCount:totalCount
          })
          // 传递数据
          this.triggerEvent('totalCountFn',totalCount)

        }
      })
    },
    // 重新渲染商品数量
    getCount(id){
      wx.cloud.callFunction({
        name:'get_shopcart',
        success:res=>{
          let data = res.result.data;
           // 重新渲染商品数量数据
          if(id){
            for(let i =0;i<data.length;i++){
              if(data[i]._id == id){
                this.properties.shopData[i].proCount = data[i].proCount
                break;
              }
            }
            this.setData({
              shopData:this.properties.shopData,
            })
          }
          // 重新渲染数据
          else{
            this.setData({
              shopData:data,
              
            })
          }
        }
      })
    },
    // 删除购物车指定记录  o{key:'',value:''}
    deleteCount(o){
      wx.cloud.callFunction({
        name:'delete_shopcart_by_id',
        data:{
          key:o.key,
          value:o.value
        },
        success:res=>{
          if(res.result.stats.removed >= 1){
             // 重新渲染商品
             this.getCount();
             // 查找购物车数量
             this.getShopCartCount()
          }
        },
        fail:err=>{}
      })
    },
    // 删除全部记录
    clearShopcart(){
      this.deleteCount({key:'isCart',value:true})
      setTimeout(()=>{
        // 关闭弹窗
        this.onRule()
      },1000)
    },
    

    
    
  }
})
