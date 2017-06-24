 var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    imgUrls: [
      '../../../images/swiper1.jpg',
      '../../../images/swiper2.jpg',
    ],
    myselfStord:{},
    otherStord:[]
  },
  goto_info:function(e){
    app.infotype = e.target.dataset.infotype
    wx.switchTab({
      url: '../info/info',
    })
  },

  onLoad:function(){
    var otherStord = app.globalData.storeInfo;
    if (otherStord.length == 1){
      otherStord = [];
    }else{
      otherStord = otherStord.split(0, 1);
    }
    if (!app.logisticFees) {
      util.api.getProductInit()
    }
    this.setData({
      myselfStord: app.globalData.storeInfo[0],
      otherStord: otherStord
    })
    wx.updateShareMenu({
      withShareTicket: true,
      success() {
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '自定义转发标题',
      path: '/pages/index/index?id=我传的东西',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})