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
  // 初始化数据
  initialize:function(){
    console.log('initialize')
    var otherStord = app.globalData.storeInfo;
    if (otherStord.length == 1) {
      otherStord = [];
    } else {
      otherStord = otherStord.splice(0, 1);
    }
    this.setData({
      myselfStord: app.globalData.storeInfo[0],
      otherStord: otherStord
    })
  },
  onLoad:function(){
    if (!app.globalData.openid){
      util.api.getOpenid(this.initialize);
    }else{
      this.initialize()
    }
    if (!app.logisticFees) {
      util.api.getProductInit()
    }
    wx.updateShareMenu({
      withShareTicket: true,
      success() {
      }
    })
  },
  onShow:function(){
    wx.connectSocket({
      url: 'wss://touchart.cn:84s43/socketHander'
    })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
    })
    wx.onSocketError(function (res) {
      console.log(res)
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