var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
  
  },
  // 升级支付
  vipPlus:function(){
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'wxpay/pay',
      data:{

      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res.data)
      }
    })
  },
 
  // 升级成功
  // 升级支付
  vipPlusSuccess: function () {
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'wxpay/paySuccess',
      data: {
        openid:app.globalData.openid,
        name: app.globalData.userInfo.nickName,
        image: app.globalData.userInfo.avatarUrl
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res.data);
        app.globalData.storeId = res.data;
        util.api.getOpenid(that.callback)
      }
    })
  },
  // skip
  callback:function(){
    wx.navigateTo({
      url: '../../user/storeUpdate/storeUpdate',
      success: function (res) { }
    })
  },
  onLoad: function (options) {
    this.vipPlusSuccess()
  },
  onShow: function () {
  
  }
})