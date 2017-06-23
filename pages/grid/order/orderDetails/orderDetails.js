var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    payorderno:'',
    ordertype:'',
    detailUrl:"order/getOrder",
    openid:1,
    ordertype2:'',
    product:{},
    expressModal1:true
  },
  // ajax请求数据
  orderDetail_request:function(){
    var that = this;
    wx.showNavigationBarLoading();
    util.api.request({
      url: this.data.detailUrl,
      data: {
        openid: this.data.openid,
        ordertype: this.data.ordertype,
        payorderno: this.data.payorderno
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        wx.hideNavigationBarLoading();
        // 转换物流公司
        for (var j in app.logisticFees) {
          if (app.logisticFees[j].logisticCode==res.data.ssStoOrder.logisticsCode) {
            res.data.ssStoOrder.logisticName = app.logisticFees[j].logisticName
          }
        }

        res.data.ssStoOrder.ordertime = util.toDate(res.data.ssStoOrder.ordertime)
        var price = 0
        for (var p in res.data.ssStoDetail){
          res.data.ssStoDetail[p].createtime = util.toDate(res.data.ssStoDetail[p].createtime);
          res.data.ssStoDetail[p].totalPrice = (res.data.ssStoDetail[p].count * res.data.ssStoDetail[p].price).toFixed(2)
          price += res.data.ssStoDetail[p].count * res.data.ssStoDetail[p].price
        }
       
        that.setData({
          product: res.data,
          price: price
        })
      }
    })
  },
  updateOrder: function () {
    var that = this;
    var order = {}
    var stoDetails = []
    var ssStoOrder = this.data.product.ssStoOrder
    if (ssStoOrder.payorderno == this.data.payorderno) {
      order.payorderno = ssStoOrder.payorderno
      order.sellerstoreid = ssStoOrder.sellerstoreid
      order.buyerstoreid = ssStoOrder.buyerstoreid
      order.logisticsCode = ssStoOrder.logisticsCode

    }
    for (var p in that.data.product.ssStoDetail){
      var obj = {}
      obj.id = that.data.product.ssStoDetail[p].id
      stoDetails.price = that.data.update_price
    }
    var object = {}
    object.openid = 1
    object.order = order
    object.stoDetails = stoDetails
    console.log(object)
    wx.showNavigationBarLoading();
    util.api.request({
      url: "order/updateOrder",
      data: object,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        that.cancel()
      }
    })
  },
  //选物流公司
  logistic:function(e){
    this.setData({
      logisticName: e.target.dataset.name,
      logisticCode: e.target.dataset.code
    })
    this.cancel()
  },
  // 修改运费
  freight:function(e){
    this.setData({
      "product.ssStoOrder.freight": parseFloat(e.detail.value)
    })
  },
  // 修改价格
  update_price:function(){
    this.setData({
      update_price: true,
    })
  },
  express:function(){
    this.setData({
      expressModal1: false
    })
  },
  cancel:function(){
    this.setData({
      expressModal1:true
    })
  },
  onLoad: function (options) {
     this.setData({
       payorderno: options.payorderno,
       ordertype: options.ordertype,
       ordertype2: options.ordertype2,
       update: 1,
       logisticFees: app.logisticFees,
     })
     this.orderDetail_request();
  }
})