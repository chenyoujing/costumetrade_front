var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data:{
    id:'',
    product:[]
  },
  backdelta:function(){
    wx.navigateBack({
      delta: 1
    })
  },
  stock_request:function(){
    var that = this;
    util.api.request({
      url: 'product/takingStock',
      data: {
        storeId: 1,
        id:that.data.id,
        page:{}
      },
      method: 'POST',
      header:{
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        that.setData({
          product: res.data
        })
      }
    })
  },
  onLoad(options){
    this.setData({
      id: options.ID
    });
    this.stock_request();
  }
})