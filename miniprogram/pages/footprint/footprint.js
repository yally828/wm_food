// miniprogram/pages/footprint/footprint.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading:true,
    isEdit:false,
    editText:'编辑',
    checkIndex:-1,
    footData:[]
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
     // 渲染足迹
    this.getFool()
  },
  // 编辑
  onEdit(){
    let text = "完成"
    if(this.data.isEdit){
      text = "编辑"

    }else{
      text = "完成"

    }
    this.setData({
      isEdit:!this.data.isEdit,
      editText:text
    })
  },
  // 选中
  onCheck(e){
    let index = e.currentTarget.dataset.index + 1;
    let currentIndex =  e.currentTarget.dataset.currentIndex;
    let id = e.currentTarget.dataset._id;
    // 根据索引值判断是否选中
    // console.log("index==>",index,"currentIndex==>",currentIndex)
    if(index == currentIndex){
      this.data.footData[index-1].footIndex = 0
    }else{
      this.data.footData[index-1].footIndex = index 
    }
    this.setData({
      footData:this.data.footData
    })
  },
  // 删除足迹
  onDeleteFoot(){
    
    for(let key in this.data.footData){
      if(this.data.footData[key].footIndex != 0){
          this.removeFoot(this.data.footData[key]._id)
      }
    }
   
  },
  // 删除
  removeFoot(id){
    wx.cloud.callFunction({
      name:'update_menu_product',
      data:{
        _id:id,
        key:'isFoot',
        value:false
      },
      success:res=>{
        if(res.result.stats.updated == 1){
          wx.showToast({
            title: '删除成功',
            icon:'none',
            duration:2000
          })
          // 重新渲染足迹
          this.getFool()

          this.setData({
            isEdit:false,
            editText:'编辑'
          })

        }
      },
      fail:res=>{
        wx.showToast({
          title: '删除失败',
          icon:'none',
          duration:2000
        })
      }
    })
  },
  // 渲染足迹
  getFool(){
    wx.cloud.callFunction({
      name:'get_foot',
      data:{},
      success:res=>{
        console.log(res.result.data)
        if(res.result.data){
          this.setData({
            footData:res.result.data
          })
        }
        
      },
      fail:err=>{
        wx.showToast({
          title: '获取失败',
          icon:'none',
          duration:2000
        })
      }
    })
  }

  
})