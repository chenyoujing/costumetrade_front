var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data:{
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
    this.setData({
      id: options.ID
    });
    if (app.getProductInit){

    }
    console.log(app)
    this.showGoodsInfo()
  }
})