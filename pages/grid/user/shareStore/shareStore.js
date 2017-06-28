var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
  
  },
  onLoad: function (options) {
    console.log(app.storeInfo)
    var image = app.globalData.storeInfo[0].images
    var images = []
    for (var p in image){
      if(images[p]){
        images.push(util.api.imgUrl + images[p])
      }else{
        images.push(images[p])
      }
    }
    this.setData({
      storeInfo: app.storeInfo,
      images: images
    })
  },
})