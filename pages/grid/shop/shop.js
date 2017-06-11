var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      '',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
  },
  onLoad:function(){
    wx.updateShareMenu({
      withShareTicket: true,
      success() {
      }
    })

    // 获取openid
    // var appid = 'wxf9f73f2b24fc98e3'; //填写微信小程序appid
    // var secret = 'c7bdb63caecd8bfbdb6c5f9e1c7a2c6d'; //填写微信小程序secret
    var that = this
    var appid ='wx82428b2ac752c6a3'
    var secret ='ed8c5aa16cf56f66339fcb4be3377e30'
    wx.login({
      success: function (loginCode) {
        console.log(loginCode.code)
        wx.request({
          url: 'http://192.168.2.221:8088/user/login',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          data:{
            code: loginCode.code,
            appId: appid,
            appSecret: secret,
          },
          method: 'POST',
          success: function (res) {
            console.log(res)
          },
          fail: function () {
            that.setData({
              openid: "openid获取失败"
            })
          }
        })

        //调用request请求api转换登录凭证
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '自定义转发标题\n自定义内容\n自定义内容\n自定义内容\n自定义内容\n自定义内容\n自定义内容\n自定义内容',
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