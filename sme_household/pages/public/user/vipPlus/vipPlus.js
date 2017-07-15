var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
  payOption:1,
  count1:1,
  count2:1,
  count3:1,
  payTotal:200,
  getList:[],
  id:1
  },
  // 选择支付
  selectOptions:function(e){
    var payOption = e.currentTarget.dataset.payoption;
    var id = e.currentTarget.dataset.id;
    var price = 200;
    var name = "count1"
    if (payOption == 1) {
      price = 200;
      name = "count1"
    } else {
      price = payOption == 2 ? 400 : 600
      name = payOption == 2 ? "count2" : "count3"
    }
    this.setData({
      payOption: payOption,
      payTotal: this.data[name]*price,
      id:id
    })
  },
  // 请求列表
  getList:function(){
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/getList',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res.data);
        that.setData({
          getList: res.data
        })
      }
    })
  },
  // 数量加减
  countAddorSub: function (e) {
    var name = e.target.dataset.name;
    var type = e.target.dataset.type;
    var count = this.data[name];
    var price = 200;
    if (name == "count1"){
      price = 200;
    }else{
      price = name == "count2" ? 400 : 600
    }
    if (type == 'sub') {
      if (count >=2 ){
        count = parseInt(count - 1)
      }
    } else {
      count = parseInt(count + 1)
    }
    var param = {};
    param[name] = count;
    param.payTotal = parseInt(count) * price;
    console.log(param)
    this.setData(param)
  },
  // 升级支付
  vipPlus:function(){
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'wxpay/pay',
      data:{
        total_fee: that.data.payTotal/1000,
        body:"注册金额",
        product_id: that.data.id,
        openid : app.globalData.openid,
        // storeId: app.globalData.storeId || undefined,
        // userId: app.globalData.userid || undefined
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res.data);
        if (typeof WeixinJSBridge == "undefined") {
          wx.showToast({
            title: "请用微信登录支付",
            mask: true,
            duration: 2000
          })
        } else {
          that.onBridgeReady("wx0f02d5eacaf954e7", res.data.timeStamp, res.data.nonceStr, res.data.packages,res.data.signType, res.data.paySign )
        }
      }
    })
  },
   // 升级支付跳转页面
  onBridgeReady: function (appId, timeStamp, nonceStr, _package, signType, paySign){
    var that = this;
    wx.requestPayment({
      timeStamp: timeStamp,
      nonceStr: nonceStr,
      package: _package,
      signType: signType,
      paySign: paySign,
      success:function(res){
        that.vipPlusSuccess()
      }
    })
  },
  // 升级成功
  vipPlusSuccess: function () {
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'wxpay/paySuccess',
      data: {
        openid:app.globalData.openid,
        name: app.globalData.userInfo.nickName,
        image: app.globalData.userInfo.avatarUrl
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res.data);
        // app.globalData.storeId = res.data;
        util.api.getOpenid(that.callback)
      }
    })
  },
  // skip
  callback:function(){
    wx.navigateTo({
      url: '../../user/storeUpdate/storeUpdate?vipPlus=true',
      success: function (res) { }
    })
  },
  onLoad: function (options) {
    this.getList()
  },
  onShow: function () {
  
  }
})