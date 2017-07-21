var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    ordertype: 2,
    orderno: "",
    paycact: [],
    logisticFees: [],
    buyerid: '',
    sellerid: '',
    expressModal: true,
    logisticCode: 0,
    logisticName: '',
    freight: 10
  },
  getOrderInfo: function () {
    var that = this;
    wx.showNavigationBarLoading();
    util.api.request({
      url: "order/getOrder",
      data: {
        payorderno: this.data.orderno,
        ordertype: 1,
        openid: app.globalData.openid,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res.data)
        var ssStoDetail = res.data.ssStoDetail
        var price = 0
        var freight = res.data.ssStoOrder.freight || 0;
        res.data.ssStoOrder.ordertime = util.toDate(res.data.ssStoOrder.ordertime)
        that.setData({
          ssStoDetail: ssStoDetail,
          ssStoOrder: res.data.ssStoOrder,
          price: res.data.ssStoOrder.debetamt,
          freight: freight,
          logisticName: res.data.ssStoOrder.logisticsCode,
          logisticCode: res.data.ssStoOrder.logisticsCode
        })
      }
    })
  },

  onLoad: function (e) {
    if (!app.logisticFees) {
      util.api.getProductInit()
    }
    this.setData({
      ordertype: e.operate,
      orderno: e.orderno,
      paycact: app.payTypeList,
      buyerid: e.buyerid,
      sellerid: e.sellerid,
      url: util.api.imgUrl
    })
    this.getOrderInfo()
  }
})