var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    storeid:'',
    payorderno:'vx201705101403563807528',
    buyerid: '',
    sellerid: '',
    product:[]
  },
  // 请求物流
  viewLogicson:function(){
    var that = this;
    wx.showNavigationBarLoading();
    util.api.request({
      url: 'order/queryLogistic',
      data: {
        payorderno: this.data.payorderno,
        buyerid: this.data.buyerid,
        sellerid: this.data.sellerid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var data = [];
        for (var p = res.data.body.length-1;p >=0;p--){
          // if (res.data.body[p].remark.indexOf('font'))
          res.data.body[p].remark = res.data.body[p].remark.replace(/<font color='red'>/g,'');
          res.data.body[p].remark = res.data.body[p].remark.replace(/<\/font>/g, '');
          console.log(res.data.body[p].remark)
          data.push(res.data.body[p])
        }
        console.log(data)
        console.log(res.data)
        that.setData({
          product: data
        })
      }
    })  
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      // payorderno: options.payorderno,
      buyerid: options.buyerstoreid,
      sellerid: options.sellerstoreid
    })
    this.viewLogicson()
  }
})