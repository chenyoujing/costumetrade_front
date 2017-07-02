//app.js
App({
  data: {
    openid: ''
  },
  onLaunch: function () {
    if (!this.globalData.openid){
      this.getOpenid()
    }
    this.getUserInfo();
  },
  getOpenid: function () {
    var that = this;
    this.globalData.userInfo = {
      appid:'wx0f02d5eacaf954e7',
      secret:'8d7f55d6a5008b7f8efead72672008a6',
      // appid:'wx82428b2ac752c6a3',
      // secret:'ed8c5aa16cf56f66339fcb4be3377e30',
    }
    wx.login({
      success: function (loginCode) {
        wx.request({
          url: 'http://192.168.2.221:8080/user/login',
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
            that.globalData.storeInfo = res.data.data.query.storeList;
            that.globalData.modifyPrice = res.data.data.employee.modifyPrice;
            that.globalData.zeroPrice = res.data.data.employee.zeroPrice;
            that.globalData.discount = res.data.data.employee.discount;
            that.globalData.storeId = res.data.data.storeId; 
            console.log(res.data )
            console.log(res.data.data.query.storeList)
           
          }
        })
      }
    })
  },
  getUserInfo: function (cb) {
    console.log(cb)
    var that = this
    // if (this.globalData.userInfo) {
    //   typeof cb == "function" && cb(this.globalData.userInfo)
    // } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo.avatarUrl)
              console.log(res.userInfo.nickName)
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    // }
  },
  globalData: {
    userInfo: null,
    openid: '',
    storeInfo: '',
  }
})
