var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    method: "4",
    pay: '',
    orderno: '',
    buyerid: '',
    sellerid: '',
    payType: '',
    operate: '',
    index:0
  },
  method: function (e) {
    this.setData({
      method: e.target.dataset.method,
      index: e.target.dataset.index
    })
  },
  changeOrderStatus: function (e) {
    var orderInfo = e.target.dataset;
    var that = this;
    if (orderInfo.pay == "2") {
      app.payOrderno = this.data.orderno;
    }
    wx.showModal({
      title: '确认下单',
      content: '确认后将会下单？',
      success: function (res) {
        if (res.confirm) {
          wx.showNavigationBarLoading();
          util.api.request({
            url: 'order/orderPay',
            data: {
              orderno: that.data.orderno,
              operate: orderInfo.pay,
              buyerid: that.data.buyerid,
              sellerid: that.data.sellerid,
              openid: 1,
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
                delta: 1
              })
            }
          })
        }
      }
    })
  },
  pay: function (e) {
    let data = e.target.dataset
    wx.showToast({
      title: '选择' + data.pay,
      icon: 'success',
      duration: 1000
    })
    setTimeout(() => {
      wx.reLaunch({
        url: '../shop'
      })
    }, 1000)
  },
  onLoad: function (options) {
    this.setData({
      pay: options.pay,
      orderno: options.orderno,
      buyerid: options.buyerid,
      sellerid: options.sellerid,
      payType: options.payType,
      operate: options.operate
    })
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