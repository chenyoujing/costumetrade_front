var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data:{
    title:'新增货品',
    picker_view: [
      { name: '名字', price: '价格', discount: '折扣', profit: '毛利' },
      { name: '名字', price: '价格', discount: '折扣', profit: '毛利' },
      { name: '名字', price: '价格', discount: '折扣', profit: '毛利' },
      { name: '名字', price: '价格', discount: '折扣', profit: '毛利' },
      { name: '名字', price: '价格', discount: '折扣', profit: '毛利' },
    ],
    screen_content3: [
      { name: 'SEASON_SPRING', value: '春' },
      { name: 'SEASON_SUMMER', value: '夏' },
      { name: 'SEASON_AUTUMN', value: '秋' },
      { name: 'SEASON_WINTER', value: '冬' },
    ],
    id:'',
    name:'',
    code:'',
    colors:'',
    description:'',
    handcount:'',
    originalPrice:'',
    prducttype:"",
    salePrice:'',
    season:'',
    sizes:'',
    timeUp:'',
    year:'',
    storeName:'',
    producttype: ["无法连接数据库"],
    producttype_index: 0,
    brand: ["无法连接数据库"],
    brand_index: 0,
    unit: ["无法连接数据库"],
    unit_index: 0
  },
  showGoodsInfo:function(){
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/getProductDetail',
      data: {
        storeId: 1,
        id:that.data.id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res)
      }
    })
  },
  
  onLoad: function (options) {
    console.log(app)
    if (options.ID !== 'null'){
      this.setData({
        id: options.ID,
        title: '货品详情'
      });
      this.showGoodsInfo()
    } 
  }
})