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
    imageInfo:'',
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  // 搜索图片
  search_image: function (){
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/getImages',
      data: {
        productName: app.imageinfo.productName,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res)
        that.setData({
          imageInfo: res
        })
      }
    })
  },
  chooseImg:function(e){
    var that = this
    app.image0 = e.target.dataset.src;
    wx.navigateTo({
      url: '../GoodsImageAdd/GoodsImageAdd'
    })
  },
  onLoad:function(e){
    this.search_image()
  }
})