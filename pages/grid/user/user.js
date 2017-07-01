var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data:{
    scanModal: true,
  },
  goto_info: function (e) {
    app.infotype = e.target.dataset.infotype
    wx.switchTab({
      url: '../info/info',
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
  request_page:function(){
    var that = this
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'store/getStore',
      data: {
        storeId: app.globalData.storeInfo[0].id,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        res.data.birthday = util.formatTime(new Date(res.data.birthday))
        that.setData({
          storeInfo:res.data
        })
        app.storeInfo = res.data
      }
    })
  },
  onLoad:function(){
    if (app.globalData.userIdentity == 1){
      this.request_page()
    }
  },
  onShow:function(){
    this.setData({
      storeInfo: app.storeInfo
    })
  }
})