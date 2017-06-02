var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    payorderno:'',
    ordertype:'',
    detailUrl:"order/getOrder",
    openid:1,
    ordertype2:'',
    product:{}
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
        wx.hideNavigationBarLoading();
        for (var p in res.data.ssStoDetail){
          res.data.ssStoDetail[p].createtime = util.toDate(res.data.ssStoDetail[p].createtime);
          res.data.ssStoDetail[p].totalPrice = (res.data.ssStoDetail[p].count * res.data.ssStoDetail[p].price).toFixed(2)
        }
       
        that.setData({
          product: res.data
        })
      }
    })
  }, 
  // 返回
  backdelta: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function (options) {
     this.setData({
       payorderno: options.payorderno,
       ordertype: options.ordertype,
       ordertype2: options.ordertype2
     })
     this.orderDetail_request();
  }
})