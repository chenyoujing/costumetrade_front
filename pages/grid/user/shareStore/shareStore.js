var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
  
  },
  onLoad: function (options) {
    console.log(app.storeInfo)
    var images = app.globalData.storeInfo[0].images
    for (var p in images){
      if(images[p]){
        images[p] = util.api.imgUrl + images[p]
      }
    }
    this.setData({
      storeInfo: app.storeInfo,
      images: images
    })
  },
})