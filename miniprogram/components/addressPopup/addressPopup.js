// components/addressPopup/addressPopup.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    addressInfo:{
      type:Array,
      value:[],
      // 当前地址索引值
      AddressIndex:-1,
      nowAddressInfo:{},
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
    onHideAddress(){
      this.triggerEvent('onHideAddress',true)
    },
    // 新增收获地址
    toNewAddress(){
      wx.navigateTo({
        url: '../../pages/newAddress/newAddress',
      })
    },
    // 编辑地址
    editAddress(res){
      let _id = res.currentTarget.dataset.id;
      wx.navigateTo({
        url: '../../pages/editAddress/editAddress?_id='+res.currentTarget.dataset.id,
      })
    },
    // 选择当前地址
    onNowAddress(event){
      let e = event.currentTarget.dataset;
      if(this.data.AddressIndex == e.key){
        return;
      }
      this.setData({
        AddressIndex:e.key,
        nowAddressInfo:e.info
      })

      // 传递数据给父组件
      this.triggerEvent("onNowAddress",this.data.nowAddressInfo);
      // 关闭弹窗
      this.onHideAddress();
    }

  }
})
