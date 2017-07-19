var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    text:'正在加载！看下面的动画好看不'
  },
  callback: function () {
    if (app.globalData.userIdentity!==2) {
      util.api.getProductInit(this.householdOrshopkeper);
    }else{
      this.householdOrshopkeper()
    }
  },
  fail:function(){
    this.setData({
      text:'登录失败'
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
    util.api.getOpenid(this.callback, this.fail);
  }
})