var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    CustomerInfo:[]
  },
  // 用户信息查询
  getClient: function () {
    var that = this
    wx.showNavigationBarLoading()
    var clientId = this.data.clientId
    var that = this
    util.api.request({
      url: 'client/getClient',
      data: {
        clientId: clientId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var CustomerInfo = res.data
        for(var p in app.custProdPriceList){
          if (CustomerInfo.type == app.custProdPriceList[p].id){
            CustomerInfo.type = app.custProdPriceList[p].custtypename
          }
        }
        that.setData({
          CustomerInfo: res.data
        })
      }
    })

  },
  onLoad: function (e) {
    this.setData({
      clientId: e.clientId,
      client: e.client
    })
    this.getClient()
  },
})