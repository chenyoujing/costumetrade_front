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
    expressModal1:true,
    paycost:0
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
        var paycost = that.data.paycost;
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
          price += Math.round((res.data.ssStoDetail[p].count * res.data.ssStoDetail[p].price) * 100) / 100 || 0
        }
        paycost = (price + res.data.ssStoOrder.freight).toFixed(2)
        that.setData({
          product: res.data,
          price: price,
          paycost: paycost
        })
      }
    })
  },
  // 保存
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
      order.freight = ssStoOrder.freight
    }
    for (var p in that.data.product.ssStoDetail){
      var obj = {}
      obj.productid = that.data.product.ssStoDetail[p].productid
      obj.productname = that.data.product.ssStoDetail[p].productname
      obj.producttype = that.data.product.ssStoDetail[p].producttype
      obj.productcolor = that.data.product.ssStoDetail[p].productcolor
      obj.productsize = that.data.product.ssStoDetail[p].productsize
      obj.orderid = that.data.product.ssStoDetail[p].orderid
      obj.price = that.data.product.ssStoDetail[p].price
      stoDetails.push(obj)
    }
    var object = {
      openid: app.globalData.openid,
      order: order,
      stoDetails: stoDetails
    }
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
        wx.showToast({
          title: '修改成功',
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      }
    })
  },
  //选物流公司
  logistic:function(e){
    this.setData({
      "product.ssStoOrder.logisticName": e.target.dataset.name,
      "product.ssStoOrder.logisticsCode": e.target.dataset.code
    })
    this.cancel()
  },
  // 修改运费
  freight:function(e){
    var paycost = this.data.paycost;
    paycost = (parseFloat(this.data.price) + parseFloat(e.detail.value || 0)).toFixed(2);
    this.setData({
      "product.ssStoOrder.freight": parseFloat(e.detail.value)||0,
      "product.ssStoOrder.freight_boolean": true,
      "product.ssStoOrder.freight_one":e.detail.value,
       paycost: paycost
    })
  },
  // 修改价格
  update_price:function(e){
    if(e.target.dataset.boolean){
      this.setData({
        update_price: false,
      })
    }else{
      this.setData({
        update_price: true,
      })
    }
  },
  price:function(e){
    var that = this;
    var paycost = that.data.paycost;
    var id = e.target.dataset.id
    var ssStoDetail = this.data.product.ssStoDetail
    var price = 0
    for (var p in ssStoDetail){
      if (ssStoDetail[p].id == id){
        ssStoDetail[p].price = parseFloat(e.detail.value) || 0
        ssStoDetail[p].price_boolean = true
        ssStoDetail[p].price_one = e.detail.value
        ssStoDetail[p].totalPrice = Math.round((ssStoDetail[p].count * ssStoDetail[p].price) * 100) / 100
        price += Math.round((ssStoDetail[p].count * ssStoDetail[p].price) * 100) / 100 || 0
      }
    }
    paycost = (price + this.data.freight).toFixed(2)
    this.setData({
      "product.ssStoDetail": ssStoDetail,
      price: price,
      paycost: paycost
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
       update: options.update,
       logisticFees: app.logisticFees,
       openid: app.globalData.openid
     })
     this.orderDetail_request();
  }
})