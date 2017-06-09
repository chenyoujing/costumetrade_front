var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    scroll_height: "",
    date: "",
  },
  onLoad: function (options) {
    var that = this
    this.setData({
      date: util.formatTime(new Date),
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scroll_height: res.windowHeight - 115
        })
      }
    })
  },
  order_delete: function () {
    wx.showModal({
      title: '删除货品',
      content: '你确定要删除该货品吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('删除')
        }
      }
    })
  },
  order: function (e) {
    var that = this
    let data = e.target.dataset
    this.setData({
      order: "0",
    })
  },
  close: function () {
    this.setData({
      order: "100%"
    })
  },
  order_submit: function (e) {
    var order = event.detail.value
    let data = e.target.dataset
    if (data.orderid) {
      var orderid = data.orderid
    } else {
      var orderid = ""
    }
    var that = this
    wx.request({
      url: 'http://192.168.2.221:8088/order/saveorder',
      data: {
        orderId: orderid,
        type: that.data.order,
        orderId: that.data.order,
        contact: order.name0,
        phone: order.phone,
        telephone: order.telephone,
        province: order.province,
        city: order.city,
        district: order.district,
        address: order.address,
        cate: "CUSTOMER_TYPE",
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          order_info: res.data.data,
        })
      }
    })
  },

})