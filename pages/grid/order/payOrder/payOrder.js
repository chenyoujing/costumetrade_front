var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
  
  },
  getOrderInfo:function(){
    var that = this;
    wx.showNavigationBarLoading();
    util.api.request({
      url: "order/getOrder",
      data: {
        payorderno: this.data.orderno,
        ordertype: this.data.ordertype,
        openid: 1,
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
        var freight = res.data.ssStoOrder.freight || 0
        for (var p in ssStoDetail){
          ssStoDetail[p].modifytime = util.toDate(ssStoDetail[p].modifytime)
          price += ssStoDetail[p].price
        }
        that.setData({
          ssStoDetail: ssStoDetail,
          price: price,
          freight: freight,
        })
      }
    })
  },
  onLoad:function(e){
    this.setData({
      ordertype: e.operate,
      orderno: e.orderno,
      paycact: app.payTypeList
    })
    this.getOrderInfo()
  }
})