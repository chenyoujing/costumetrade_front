var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    pay: '',
    orderno: '',
    buyerid: '',
    sellerid: '',
    payType: '',
    operate: '',
    imagePAy:""
  },
  // 获取支付信息
  enterPayInfo:function(){
    var that = this;
    wx.showNavigationBarLoading();
    util.api.request({
      url: 'order/enterPay',
      data: {
        storeId:app.globalData.storeId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(that.data.payType)
      
        for(var p in res.data){
          console.log(res.data[p].dictText)
          if (res.data[p].dictText.indexOf(that.data.payType) > -1){
            console.log(res.data[p].dictValue)
            that.setData({
              imagePAy: res.data[p].dictValue
            })
          }
        }
      }
    })
  },
  changeOrderStatus: function (e) {
    var that = this;
    wx.showModal({
      title: '确定更改',
      content: '我已经支付过，确定？',
      success: function (res) {
        if (res.confirm) {
          that.surepay(e);
        }
      }
    })
  },
  // 确认已经付过款
  surepay:function(e){
    var that = this;
    var orderInfo = e.target.dataset;
    if (orderInfo.pay == "2") {
      app.payOrderno = this.data.orderno;
    }
    wx.showNavigationBarLoading();
    util.api.request({
      url: 'order/orderPay',
      data: {
        orderno: that.data.orderno,
        operate: orderInfo.pay,
        buyerid: that.data.buyerid,
        sellerid: that.data.sellerid,
        openid: app.globalData.openid,
        pay: that.data.pay
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.showToast({
          title: '成功',
          mask: true,
          duration: 2000
        })
        wx.navigateBack({
          delta: 2
        })
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      pay: options.pay,
      orderno: options.orderno,
      buyerid: options.buyerid,
      sellerid: options.sellerid,
      payType: options.payType,
      operate: options.operate,
      url: util.api.imgUrl,
      seller: options.sellername
    })
    this.enterPayInfo();
    console.log({
      pay: options.pay,
      orderno: options.orderno,
      buyerid: options.buyerid,
      sellerid: options.sellerid,
      payType: options.payType,
      operate: options.operate
    })
  }
})