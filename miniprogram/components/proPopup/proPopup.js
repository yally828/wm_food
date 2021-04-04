// components/proPopup/proPopup.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 商品信息
    ruleData:{
      type:Object,
      value:{}
    },
    // 已选规格
    ruled:{
      type:Object,
      value:{}
    },
    // 是否隐藏购物车按钮
    isAddCartBtn:{
      type:Boolean,
      value:false
    },
    // 商品入购数量
    proCount:{
      type:Number,
      value:1
    },
    // 入购id
    cart_id:{
      type:String,
      value:''
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    isAddCartBtn:false,
    ruleIndex:0,
    scrollTop:-1,
    proCount:1,
    // 加入购物车数据
    cartData:{
      id:'',
      ruled:{},
      price:'',
      src:'',
      title:'',
      price:'',
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭弹窗
    onClose(){
      this.triggerEvent("onRule",{type:'isProShow',show:true})

      this.setData({
        isAddCartBtn:false,
        scrollTop:'0',
      })
    },
    // 规则选择索引
    onRuleTab(event){
      let dataset = event.currentTarget.dataset;
      // 当前索引值
      let currentIndex  = dataset.currentIndex;
      // 点中索引
      let index  = dataset.index;
      // 每一行索引
      let ruleIndex = dataset.ruleIndex;
      
      // 传递参数
      this.triggerEvent("onRuleTab",{currentIndex,index,ruleIndex})

     
      
    },
    // 加入购物车
    onAddCart(){
      this.setData({
        isAddCartBtn:true
      })
      if(this.properties.proCount == 0 || this.data.proCount == 0){
        wx.showToast({
          title:"加入购物车失败",
          icon:none,
          duration:2000
        })
        return
      }
      // 加入购物车数据
      wx.cloud.callFunction({
        name:'add_shopcart',
        data:{
          pid:this.properties.ruleData._id,
          ruled:this.properties.ruled,
          proCount:this.properties.proCount,
          title:this.properties.ruleData.title,
          price:this.properties.ruleData.price,
          src:this.properties.ruleData.src,
          isCart:this.properties.ruleData.isCart
          
        },
        success:res=>{
          // 查找购物车数量
          this.getShopCartCount();
        },
        fail:err=>{
          wx.showToast({
            title: '加入购物车失败',
            icon:'none',
            duration:2000
          })
        }
      })
    },
    // 数量增加
    onUpNum(){
      let num = 1;
      this.setData({
        proCount:this.data.proCount + num
      })
      // 更改数据库商品数量
      this.updateCount(this.data.proCount)
    },
    // 数量减少
    onDownNum(){
      if(this.data.proCount <= 1) return
      let num = 1;
      this.setData({
        proCount:this.data.proCount - num
      })
       // 更改数据库商品数量
       this.updateCount(this.data.proCount);
       
    },
    // 更改数据库商品数量
    updateCount(proCount){
      wx.cloud.callFunction({
        name:'update_shopcart_by',
        data:{
          _id:this.properties.cart_id,
          proCount:this.data.proCount 
        },
        success:res=>{
          // 查找购物车数量
          this.getShopCartCount();
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
          // 总量
          let totalCount = 0;
          // 总价
          let totalPrice = 0;
          let data = res.result.data;
          for(let i =0;i<data.length;i++){
            totalCount += data[i].proCount
            data[i].price = data[i].price * 10 
            totalPrice += data[i].proCount * data[i].price / 10
          }
          this.setData({
            totalPrice:totalPrice 
          })
          // 传递数据
          this.triggerEvent('totalCountFn',totalCount)
          // console.log("查找购物车数量",totalCount)

        }
      })
    }
    

  }
})
