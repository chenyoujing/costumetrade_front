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
  getOpenid: function () {
    var that = this;
    app.globalData.userInfo = {
      appid: 'wx82428b2ac752c6a3',
      secret: 'ed8c5aa16cf56f66339fcb4be3377e30',
      storeInfo: '',
      storeInfo: ''
    }
    wx.login({
      success: function (loginCode) {
        wx.request({
          url: 'http://192.168.2.221:8088/user/login',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data: {
            code: loginCode.code,
            appId: app.globalData.userInfo.appid,
            appSecret: app.globalData.userInfo.secret
          },
          method: 'POST',
          success: function (res) {
            app.globalData.userInfo.code = loginCode.code
            app.globalData.openid = res.data.data.query.openid;
            app.globalData.privilegeEmployees = res.data.data.employee.privilegeEmployees;
            app.globalData.userIdentity = res.data.data.userIdentity;
            app.globalData.storeInfo = res.data.data.query.storeList;
            app.globalData.modifyPrice = res.data.data.employee.modifyPrice;
            app.globalData.zeroPrice = res.data.data.employee.zeroPrice;
            app.globalData.discount = res.data.data.employee.discount;
            console.log(app.globalData.openid)
            console.log(res.data.data.query.storeList);
            that.initialize()
          }
        })
      }
    })
  },
  // 初始化数据
  initialize:function(){
    var otherStord = app.globalData.storeInfo;
    if (otherStord.length == 1) {
      otherStord = [];
    } else {
      otherStord = otherStord.split(0, 1);
    }
    this.setData({
      myselfStord: app.globalData.storeInfo[0],
      otherStord: otherStord
    })
  },
  onLoad:function(){
    this.getOpenid();
    
    if (!app.logisticFees) {
      util.api.getProductInit()
    }
    console.log(44444444444444444)
    this.initialize()
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