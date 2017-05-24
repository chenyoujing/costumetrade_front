//app.js
App({
  onLaunch: function () {

    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //获取openid
    var that = this
    wx.login({
      success: function (loginCode) {
        var appid = 'wxf9f73f2b24fc98e3'; //填写微信小程序appid
        var secret = 'c7bdb63caecd8bfbdb6c5f9e1c7a2c6d'; //填写微信小程序secret
        //调用request请求api转换登录凭证
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&grant_type=authorization_code&js_code=' + loginCode.code,
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            wx.setStorageSync('openid', res.data.openid)//openid存入本地缓存中
          },
          fail: function () {
            wx.setStorageSync('openid', "")//openid失败存空
          }
        })
      }
    })
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },

  globalData:{
    userInfo:null,
  }
})