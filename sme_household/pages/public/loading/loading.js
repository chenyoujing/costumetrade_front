var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    text:''
  },
  callback: function () {
    if (app.globalData.userIdentity!==2) {
      util.api.getProductInit(this.householdOrshopkeper);
    }else{
      this.householdOrshopkeper()
    }
  },
  fail:function(){
    var that = this
    wx.showModal({
      title: '登录失败',
      cancelText: '确认',
      confirmText: '重新登录',
      success:function(){
        if (res.confirm) {
          that.onLoad()
        }
      }
    })
  },
  // 判断权限显示页面
  householdOrshopkeper:function(){
    var householdurl = "../../household/shop/shop";
    var shopkeper = "../../shopkeeper/index/index";
    var url = app.globalData.userIdentity == 2 ? householdurl : shopkeper;
    wx.redirectTo({
      url: url,
      success: function (res) { }
    })
  },
  onLoad: function (options) {
    console.log(Date())
    util.api.getOpenid(this.callback, this.fail);
  }
})