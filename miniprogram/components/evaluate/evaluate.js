// components/evaluate/evaluate.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    doneData:{
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isBool:true,
    id:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onRule(e){
      this.setData({
        isBool:false,
        id:e.currentTarget.dataset.id
      })
    },
    onClose(){
      this.setData({
        isBool:true,
      })
    },
  
    onDelete(){
      wx.cloud.callFunction({
        name:'delete_assess_by',
        data:{
          id:this.data.id
        },
        success:res=>{
         
          if(res.result.startsWith.removed == 1){
            wx.showToast({
              title: '删除评价成功',
              icon:"none",
              duration:2000
            })
            // 重新渲染已评价
            this.triggerEvent('getAssess')
            this.setData({
              isBool:true,
            })
          }
        },
        fail:err=>{
          wx.showToast({
            title: '删除评价失败',
            icon:"none",
            duration:2000
          })
        }
      })
    },
    
  },
})

    
