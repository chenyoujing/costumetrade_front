var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
  
  },
  onLoad: function (options) {
    console.log(app.globalData.storeInfo[0])
    var image = app.globalData.storeInfo[0].images
    var images = []
    for (var p in image){
      if(image[p]){
        images.push(util.api.imgUrl + image[p])
      }else{
        images.push(image[p])
      }
    }
    this.setData({
      storeInfo: app.globalData.storeInfo[0],
      images: images,
      url: util.api.imgUrl,
    })
  },
})