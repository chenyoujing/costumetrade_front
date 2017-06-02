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
    var appid ='wx82428b2ac752c6a3'
    var secret ='ed8c5aa16cf56f66339fcb4be3377e30'
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + secret,
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.access_token)
        wx.request({
          url: 'http://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + res.data.access_token,
          data: {
            scene:'123',
          },
          method: 'POST',
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data)

          }
        })
      }
    })
  },
  onShareAppMessage: function () {
  
  }
})