var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    id: "",
    scrollTop: '800',
    input_type: "number",
    input_foucs: "",
    products_info: "",
    keyboard_width: "",
    orderid: "",
    color: ["藏青色", "玫红色"],
    size: ["S", "M"],
  },
  onLoad: function () {
    var that = this
    setTimeout(() => {
      this.setData({
        scrollTop: this.data.scrollTop,
      })
    }, 1000)
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          keyboard_width: (res.windowWidth - 8)/4 - 4
        })
      }
    })
  },
  onShow: function (options) {
    var that = this
    setTimeout(() => {
      this.setData({
        scrollTop: this.data.scrollTop,
      })
    }, 100)
  },
  input_type_change: function (e) {
    var that = this
    if (this.data.input_type == "number") {
      that.setData({
        input_type: "text",
      })
      setTimeout(() => {
        this.setData({
          input_foucs: "foucs",
        })
      }, 100)
    }else{
      that.setData({
        input_type: "number",
      })
      setTimeout(() => {
        this.setData({
          input_foucs: "foucs",
        })
      }, 100)
    }
  },
  input_change: function (e) {
    var that = this
    if (e.detail.value) {
      wx.request({
        url: 'http://192.168.2.221:8088/product/getProducts',
        data: {
          storeId: 1,
          code: e.detail.value
        },
        method: 'GET',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          for (var i = 0; i < res.data.data.length; i++) {
            res.data.data[i].timeUp = util.toDate(res.data.data[i].timeUp)
          } 
          if (res.data.data[0] != undefined) {
            that.setData({
              products_info: res.data.data,
            })
          }else{
            that.setData({
              products_info: "",
            })
          }
        }
      })
    }else{
      that.setData({
        products_info: "",
      })
    }
  },
  products_add: function (e) {
    let data = e.target.dataset
    this.setData({
      id: e.target.dataset.id
    })
  },
  //买单
  order: function () {
    wx.switchTab({
      url: '../order/order'
    })
  },
  order_buy: function (e) {
    var that = this
    let data = e.target.dataset
    that.setData({
      orderid: data.orderid
    })
    console.log(data)
  },
  order_back: function () {
    this.setData({
      orderid: ""
    })
  }
})