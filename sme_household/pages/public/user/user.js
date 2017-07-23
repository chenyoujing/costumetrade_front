var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data:{
    scanModal: true,
  },
  goto_info: function (e) {
    app.infotype = e.target.dataset.infotype
    wx.switchTab({
      url: '../../orginal/info/info',
    })
  },
  scan: function () {
    this.setData({
      scanModal: false,
    })
  },
  cancel: function () {
    this.setData({
      scanModal: true,
    })
  },
  address:function(){
    wx.chooseAddress({
      success: function(res) {
        console.log(res)
      },
    })
  },
  
  onLoad: function (e) {
    this.setData({
      shopkeeper: e.shopkeeper
    })
  },
  onShow:function(){
    var object = util.api.authorityPurchaseprice();
    console.log(app.globalData.userInfo)
    console.log(app.globalData.storeInfo[0])
    this.setData(object)
    this.setData({
      userInfo: app.globalData.userInfo,
      userIdentity: app.globalData.userIdentity
    })
   
  }
})