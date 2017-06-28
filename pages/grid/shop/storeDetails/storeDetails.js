var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {

  },
  request_page:function(){
    var that = this
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'store/getStore',
      data: {
        storeId: that.data.storeId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        res.data.birthday = util.formatTime(new Date(res.data.birthday))
        that.setData({
          storeInfo: res.data
        })
      }
    })

  },
  onLoad:function(e){
    this.setData({
      storeId: e.id,
    })
    this.request_page()
  }
})