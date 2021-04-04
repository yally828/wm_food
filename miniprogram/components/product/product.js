// components/product/product.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    productsData:{
      type:Object,
      value:{},
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
    onRule(event){
      let ruleData = event.currentTarget.dataset.ruledata;
      this.triggerEvent('onRule',{type:"isProShow",show:false,ruleData:ruleData})
    },
    
  }
})
