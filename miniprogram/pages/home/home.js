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
    products:[],
    loading:true,
    //组件显示隐藏
    isProShow:true,
    // 购物车弹窗显示隐藏
    isCartShow:true,
    // 
    onType:'',
    // 商品数量
    proCount:1,
   
    ruleData:{},
    // 已选规格信息
    ruled:{
      taste:"蜂蜜芥末味",
      drink:"冰红茶",
      num:"约400克"
    },
    // 购物车按钮
    isAddCartBtn:false,
    // 入购id
    cart_id:'',
    // 购物车数据
    shopcartData:[],
    // 购物车总数量
    totalCount:0,
    // 购物车总价
    totalPrice:0,

   

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMenuList();
    this.getMenuProducts({key:'type',value:'tj'});

    // 查询购物车数据
    this.getShopCartCount()
    
  },
  
  // 获取菜单列表 get_menu_list
  getMenuList(){
    wx.cloud.callFunction({
      name:"get_menu_list",
      success:res=>{
        this.setData({
          asideMenuList:res.result.data,
          loading:false
        })
      },
      fail:err=>{
        wx.showToast({
          title: '获取菜单失败',
          icon: 'none',
          duration: 2000
        })
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

    this.getMenuProducts({key:'type',value:e.currentTarget.dataset.type})
    
  },
  // 获取菜单
  getMenuProducts(o){
    wx.showLoading({
      title:"加载中"
    })
    wx.cloud.callFunction({
      name:'get_menu_products',
      data:{
        key:o.key,
        value:o.value
      },
      success:res=>{
        this.setData({
          products:res.result.data
        })
        wx.hideLoading()

       
      },
      fail:err=>{
        wx.showToast({
          title: '获取菜单失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 购物车弹窗
  onCartShow(){
    this.setData({
      isCartShow:!this.data.isCartShow
    })
    // this.getCartData();
    this.getShopCartCount()
   
  },
  // 弹窗
  onRule(event){
    // 打开 选规格弹窗
    if(event.detail.type == "isProShow"){
      this.setData({
        isProShow:event.detail.show,
        proCount:1
      })
        // 打开弹窗时
      if(!event.detail.show){
        // 渲染规格信息
        
        this.setData({
          ruleData:event.detail.ruleData,
        })

        // 已选规格
        this.selectedRule()
        
      }
    }else{
      // 关闭 购物车弹窗
      this.setData({
        isCartShow:event.detail.show,
        // bottom:'-60%'
      })
      
    }
  },

  // 修改currentIndex
  onRuleTab(e){
    let currentCon = this.data.ruleData.con[e.detail.ruleIndex];
    currentCon.currentIndex = e.detail.index;

    if(e.detail.currentIndex == e.detail.index){
      return
    }
    this.setData({
      ruleData: this.data.ruleData
    })
    // 已选规格
    this.selectedRule()
    
  },
  // 已选规格
  selectedRule(){
    this.data.ruleData.con.map(v=>{
      this.data.ruled[v.type] = v.rule[v.currentIndex];
    })
    this.setData({
      ruled:this.data.ruled
    })


    // 根据已选规则 查询数据库 并判断是否显示购物车按钮
    this.getShopCart(this.data.ruleData._id,this.data.ruled);

  },
  
   // 根据规格 查找购物车数据库
  getShopCart(pid,ruled){
    wx.cloud.callFunction({
      name:'get_shopcart_by',
      data:{
        pid:pid,
        ruled:ruled
      },
      success:res=>{
        // 购物车按钮
        let isAddCartBtn = false;
        // 入购商品id
        let cart_id=''
        if(res.result.data.length == 0){
          // 购物车没有该规格 购物车按钮显示
            isAddCartBtn = false
        }else{
          // 购物车有该规格 购物车按钮隐藏
          isAddCartBtn = true;
          // 并返回该规格数量
          this.data.proCount = res.result.data[0].proCount
          cart_id = res.result.data[0]._id
        }
        this.setData({
          isAddCartBtn:isAddCartBtn,
          proCount:this.data.proCount,
          cart_id:cart_id
        })

        // 足迹 修改isFoot = true
        this.changeFoot(pid)

      },
      fail:err=>{
      }
      
    })
  },
  // 查找购物车数量
  getShopCartCount(){
    wx.cloud.callFunction({
      name:'get_shopcart',
      success:res=>{
        let data = res.result.data;
        let totalCount = 0
        let totalPrice = 0
        let price = 0
        for(let i =0;i<data.length;i++){
          totalCount += data[i].proCount
          price = data[i].proCount *10 * data[i].price * 10 / 100
          totalPrice = (totalPrice * 10 + price * 10)  / 10
        }
        this.setData({
          totalCount:totalCount,
          totalPrice:totalPrice ,
          shopcartData:res.result.data
        })
        // console.log("查找购物车data",this.data.shopcartData)
        
        this.expireDelete(res.result.data)

      }
    })
  },
  // 接收购物车数量数据
  totalCountFn(event){
    this.setData({
      totalCount:event.detail
    })
  },
  // 足迹 修改isFoot = true
  changeFoot(id){
    wx.cloud.callFunction({
      name:'update_menu_product',
      data:{
        _id:id,
        key:'isFoot',
        value:true
      },
      success:res=>{
        if(res.result.stats.updated == 1){
          console.log("足迹 修改成功")
          this.setData({
          })
        }
      },
      fail:res=>{
        console.log("足迹 修改失败")
      }
    })
  },
  // 过期删除购物车
  expireDelete(data){
    let now = new Date().getTime();
    // console.log("当前时间戳==>",now)
    // 半个小时时间戳
    let halfHour = 0.5*3600*60;

    for(let i = 0;i<data.length;i++){
      let sub = now - data[i].time;
      if(sub >= halfHour){
        this.deleteCount(data[i]._id)
      }
    }
  },
  deleteCount(id){
    wx.cloud.callFunction({
      name:'delete_shopcart_by_id',
      data:{
        key:'_id',
        value:id
      },
      success:res=>{
        if(res.result.stats.removed >= 1){
           // 查找购物车
           this.getShopCartCount()
           this.setData({
            totalCount:0
           })
        }
      },
      fail:err=>{}
    })
  },
  
})