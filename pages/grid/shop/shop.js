import socket from '../../../utils/socket.js'
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
    if (!app.logisticFees && app.globalData.userIdentity!==2) {
      util.api.getProductInit()
    }
    wx.updateShareMenu({
      withShareTicket: true,
      success() {
      }
    })
  },
  onShow:function(){
    var socketOpen = false
    var socketMsgQueue = ['']
    var openidList = ['oDy7t0GCpfxdFdFyNPhu_VYVufS4','oDy7t0HjUcYhdFMgiFbuFHCqSEGo']
    if (app.globalData.openid == openidList[0]){
      var openid1 = openidList[0]
      var openid2 = openidList[1]
    }else{
      var openid2 = openidList[0]
      var openid1 = openidList[1]
    }
    // wx.request({
    //   url: 'https://api.weixin.qq.com/cgi-bin/token',
    //   data: {
    //     grant_type: "client_credential",
    //     appid: "wx82428b2ac752c6a3",
    //     secret: "ed8c5aa16cf56f66339fcb4be3377e30",
    //   },
    //   method: 'GET',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   success: function (res) {
    //     console.log(res.data.access_token)
    //     app.access_token = res.data.access_token

    //   }
    // })

    
    // wx.connectSocket({
    //   url: 'wss://touchart.cn:8443/socketHander',
    //   data:{
    //     fUserName:openid2,
    //     tUserName:openid1,
    //   },
    //   method: "GET"
    // })
    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
    })
    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data)
    })
    wx.onSocketClose(function (res) {
      console.log('WebSocket 连接打开失败')
    })
    // wx.onSocketOpen(function (res) {
    //   wx.sendSocketMessage({
    //     data: '123',
    //     success: function () {
    //       console.log('123')
    //     }
    //   })
    // })
    // wx.sendSocketMessage({
    //   data: '123',
    //   success:function(){
    //     console.log('123')
    //   }
    // })
    wx.getSetting({
      success(res) {
        if (!res['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              wx.saveImageToPhotosAlbum()
            }
          })
        }
      }
    })
  },
  aa:function(e){
    // console.log(e.detail.formId)
    // wx.request({
    //   url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + app.access_token,
    //   data: {
    //     touser: app.globalData.openid,
    //     template_id: "fYO5us4tA7W6MITP4o7FcwhS6FeECr3gdcfuiTYB_5k",
    //     form_id: e.detail.formId,
    //     data: {
    //       "keyword1": {
    //         "value": "339208499",
    //         "color": "#173177"
    //       },
    //       "keyword2": {
    //         "value": "2015年01月05日 12:30",
    //         "color": "#173177"
    //       },
    //       "keyword3": {
    //         "value": "粤海喜来登酒店",
    //         "color": "#173177"
    //       },
    //       "keyword4": {
    //         "value": "广州市天河区天河路208号",
    //         "color": "#173177"
    //       }
    //     },
    //   },
    //   method: 'POST',
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //   }
    // })

    var openidList = ['oDy7t0GCpfxdFdFyNPhu_VYVufS4', 'oDy7t0HjUcYhdFMgiFbuFHCqSEGo']
    if (app.globalData.openid == openidList[0]) {
      var openid1 = openidList[0]
      var openid2 = openidList[1]
    } else {
      var openid2 = openidList[0]
      var openid1 = openidList[1]
    }

    wx.sendSocketMessage({
      data: 'wss://touchart.cn:8443/socketHander?fUserName=' + openid2 + '&tUserName=' + openid1,
      success: function () {
        console.log('123')
      }
    })
  },
  bb:function(){
      wx.closeSocket()

    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
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