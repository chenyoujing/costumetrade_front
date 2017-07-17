// pages/shopkeeper/info/chat/chat.js
Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  aa:function(){
    try {
      var res = wx.getSystemInfoSync()
      console.log(res.model)
      console.log(res.pixelRatio)
      console.log(res.windowWidth)
      console.log(res.windowHeight)
      console.log(res.language)
      console.log(res.version)
      console.log(res.platform)
    } catch (e) {
      // Do something when catch error
    }
  }
})