//index.js

//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
  },

  onLoad: function () {
    var that = this

    //获取openid
    console.log(wx.getStorageSync('openid'))
  }
})
