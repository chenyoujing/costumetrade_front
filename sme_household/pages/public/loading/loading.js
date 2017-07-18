var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
  
  },
  callback: function () {
    if (app.globalData.userIdentity!==2) {
      util.api.getProductInit(this.householdOrshopkeper);
    }else{
      this.householdOrshopkeper()
    }
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
    util.api.getOpenid(this.callback);
  }
})