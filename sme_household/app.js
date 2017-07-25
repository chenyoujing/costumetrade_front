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
    console.log(55)
    var that = this;
    this.globalData.userInfo = {
      appid:'wx0f02d5eacaf954e7',
      secret:'8d7f55d6a5008b7f8efead72672008a6',
    }
    wx.login({
      success: function (loginCode) {
        wx.getUserInfo({
          success: function (res) {
            wx.request({
              url: 'http://192.168.2.221:8088/user/login',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                code: loginCode.code,
                encryptedData: res.encryptedData,
                iv: res.iv,
              },
              method: 'POST',
              success: function (res) {
                that.globalData.report = res.data.data.report;
                that.globalData.userInfo.code= loginCode.code;
                that.globalData.userInfo.name = res.data.data.name;  
                that.globalData.userInfo.fansCount = res.data.data.fansCount;
                that.globalData.userInfo.photo = res.data.data.photo; 
                that.globalData.openid = res.data.data.query.openid;
                that.globalData.privilegeEmployees = res.data.data.employee.privilegeEmployees;
                that.globalData.userIdentity = res.data.data.userIdentity;
                that.globalData.storeInfo = res.data.data.products || [];
                that.globalData.modifyPrice = res.data.data.employee.modifyPrice;
                that.globalData.zeroPrice = res.data.data.employee.zeroPrice;
                that.globalData.discount = res.data.data.employee.discount;
                that.globalData.storeId = res.data.data.storeId; 
                that.globalData.userid = res.data.data.userid;
                console.log(res.data)
              }
            })
          }
        })
      }
    })
  },
  getUserInfo: function (cb) {
    var that = this;
    wx.checkSession({
      success: function (res) {
        //session 未过期，并且在本生命周期一直有效
        // console.log(45)
        // console.log(res)
        // that.getOpenid()
      },
      fail: function () {
        that.getOpenid()
      }
    })
    var that = this
    // if (this.globalData.userInfo) {
    //   typeof cb == "function" && cb(this.globalData.userInfo)
    // } else {
      //调用登录接口
     
    // }
  },
  login:function(){
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
      },
      fail: function () {
        //登录态过期
        wx.login() //重新登录
      }
    })
  },
  globalData: {
    userInfo: null,
    openid: '',
    storeInfo: '',
  }
})
