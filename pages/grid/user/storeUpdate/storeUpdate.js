var util = require('../../../../utils/util.js')
var app = getApp()
Page({

  data: {
  
  },
  tx:function(){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
      }
    })
  },
  address:function(){
    wx.chooseAddress({
      success: function (res) {
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })
  },
  update_storeInfo: function (e) {
    var that = this;
    var object = e.detail.value
    object.storeId = app.globalData.storeInfo[0].id
    object.userId = app.globalData.openid
    console.log(object)
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'user/saveUserOrStore',
      data: object,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.showToast({
          title: '成功',
          mask: true,
          duration: 2000
        })
      }
    })
  },

  onLoad: function (e) {
    console.log(app.globalData.storeInfo)
    this.setData({
      shopInfo: app.globalData.storeInfo,
    })
  }
})