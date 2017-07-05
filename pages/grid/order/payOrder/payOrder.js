var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    ordertype: 2,
    orderno: "",
    paycact: [],
    logisticFees: [],
    buyerid:'',
    sellerid: '',
    expressModal: true,
    logisticCode: 0,
    logisticName: '',
    freight: 10
  },
  getOrderInfo:function(){
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
        for (var p in ssStoDetail){
          ssStoDetail[p].modifytime = util.toDate(ssStoDetail[p].modifytime)
          // price += ssStoDetail[p].price
        }
        // 转换物流公司
        for (var j in that.data.logisticFees) {
          if (that.data.logisticFees[j].logisticCode == res.data.ssStoOrder.logisticsCode) {
           var logisticName = that.data.logisticFees[j].logisticName
          }
        }
        that.setData({
          ssStoDetail: ssStoDetail,
          price: res.data.ssStoOrder.debetamt,
          freight: freight,
          logisticName: logisticName,
          logisticCode: that.data.logisticFees[j].logisticCode
        })
      }
    })
  },
  // 更改运费
  changeLogisticFees: function () {
    this.setData({
      expressModal: false
    })
  },
  // 选择更改后的快递
  logistic: function (e) {
    var logisticName = e.target.dataset.name;
    var logisticCode = e.target.dataset.code;
    var fixedFee = e.target.dataset.fixedfee;
    console.log(fixedFee)
    this.setData({
      logisticName: logisticName,
      logisticCode: logisticCode,
      freight: fixedFee
    })
    this.cancel()
  },
  // 取消快递选择
  cancel: function () {
    this.setData({
      expressModal: true
    })
  },
  onLoad:function(e){
    if (!app.logisticFees) {
      util.api.getProductInit()
    }
    this.setData({
      ordertype: e.operate,
      orderno: e.orderno,
      paycact: app.payTypeList,
      logisticFees: app.logisticFees,
      buyerid: e.buyerid,
      sellerid: e.sellerid
    })
    this.getOrderInfo()
  }
})