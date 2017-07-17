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
  getOpenid: function (callback) {
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
                that.globalData.userInfo.code= loginCode.code;
                that.globalData.userInfo.name = res.data.data.name;  
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
                console.log(that.globalData)
                that.householdOrshopkeper(res.data.data.userIdentity)
                callback
              }
            })
          }
        })
      }
    })
  },
  // 判断权限显示页面
  householdOrshopkeper: function (userIdentity) {
    console.log(this.firstLogin)
    var householdurl = this.firstLogin ?'../../household/shop/shop':"pages/household/shop/shop";
    console.log(householdurl)
    var shopkeper = this.firstLogin ? './index' : "pages/shopkeeper/index/index";
    console.log(shopkeper)
    var url = userIdentity == 2 ? householdurl : shopkeper;
    this.firstLogin = undefined;
    wx.redirectTo({
      url: url,
      success: function (res) { }
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
              that.globalData.myInfo = res.userInfo;
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
