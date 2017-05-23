var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    scroll_height: "",
    date: "",
    bill_modal: "none",
    bill_modal_opacity: "",
    wechat_modal: "none",
    wechat_modal_opacity: "",
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
  order_delete: function (){
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
  //打印账单
  bill_print: function (e) {
    var that = this
    let data = e.target.dataset

    this.setData({
      bill_modal: "block",
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(1).step()
    this.setData({
      bill_modal_opacity: animation.export()
    })
  },
  bill_modal_close: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(0).step()
    this.setData({
      bill_modal_opacity: animation.export()
    })
    setTimeout(() => {
      this.setData({
        bill_modal: "none",
      })
    }, 300)
  },
  //微信账单
  bill_wechat: function (e) {
    var that = this
    let data = e.target.dataset

    this.setData({
      wechat_modal: "block",
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(1).step()
    this.setData({
      wechat_modal_opacity: animation.export()
    })
  },
  wechat_modal_close: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(0).step()
    this.setData({
      wechat_modal_opacity: animation.export()
    })
    setTimeout(() => {
      this.setData({
        wechat_modal: "none",
      })
    }, 300)
  },
  //单据时间
  date: function (e) {
    const val = e.detail.value
    this.setData({
      date: val
    })
  },

})