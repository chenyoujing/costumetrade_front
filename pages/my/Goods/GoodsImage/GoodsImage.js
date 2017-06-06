var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    screen_content2: [
      { brandname: 'Armani' },
      { brandname: 'Burberry' },
      { brandname: 'Calvin Klein' },
      { brandname: 'Chanel' },
    ],
  },
  // 搜索图片
  search_image: function (productName){
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/getImages',
      data: {
        productName: productName,
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
  onLoad:function(e){
    this.search_image(e.productName)
  }
})