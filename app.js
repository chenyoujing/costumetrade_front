
//app.js
App({
  data: {
    openid: ''
  },
  onLaunch: function () {
    this.getOpenid();
    this.getUserInfo();
  },
  getOpenid: function () {
    var that = this;
    this.globalData.userInfo = {
      appid:'wx82428b2ac752c6a3',
      secret : 'ed8c5aa16cf56f66339fcb4be3377e30'
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
            appId: that.globalData.userInfo.appid,
            appSecret: that.globalData.userInfo.secret
          },
          method: 'POST',
          success: function (res) {
            that.globalData.userInfo.code= loginCode.code
            that.globalData.openid = res.data.data.query.openid;
            that.globalData.privilegeEmployees = res.data.data.employee.privilegeEmployees;
            that.globalData.userIdentity = res.data.data.userIdentity;
            console.log(that.globalData.openid )
          }
        })

        //调用request请求api转换登录凭证
      }
    })
  },
  getUserInfo: function (cb) {
    console.log(cb)
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    openid: '',
    
  }
})
