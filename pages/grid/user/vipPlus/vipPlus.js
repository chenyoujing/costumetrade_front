var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
  
  },
  // 升级支付
  vipPlus:function(){
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'wxpay/pay',
      data:{
        total_fee:0.01,
        body:"注册金额",
        product_id:'4545',
        openid : app.globalData.openid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res.data);
        if (typeof WeixinJSBridge == "undefined") {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady,
              false);
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
          }
        } else {
          that.onBridgeReady("wx0f02d5eacaf954e7", res.data.timeStamp, res.data.nonceStr, res.data.signType, res.data.paySign, )
        }
      }
    })
  },
   // 升级支付跳转页面
  onBridgeReady: function (appId, timeStamp, nonceStr, _package, signType, paySign){
    WeixinJSBridge.invoke('getBrandWCPayRequest', {
      "appId": appId,
      "timeStamp": timeStamp,
      "nonceStr": nonceStr,
      "package": _package,
      "signType": signType,
      "paySign": paySign
    }, 
      function (res) {
        if (res.err_msg == "get_brand_wcpay_request:ok") {
          alert("支付成功");
        }
        if (res.err_msg == "get_brand_wcpay_request:cancel") {
          alert("交易取消");
        } 
        if (res.err_msg == "get_brand_wcpay_request:fail") {
          alert(JSON.parse(res));
            alert("支付失败");
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
        app.globalData.storeId = res.data;
        util.api.getOpenid(that.callback)
      }
    })
  },
  // skip
  callback:function(){
    wx.navigateTo({
      url: '../../user/storeUpdate/storeUpdate',
      success: function (res) { }
    })
  },
  onLoad: function (options) {
    // this.vipPlusSuccess()
    this.vipPlus()
  },
  onShow: function () {
  
  }
})