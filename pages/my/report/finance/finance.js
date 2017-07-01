var util = require('../../../../utils/util.js')
var wxCharts = require('../../../../utils/wxcharts.js')
var app = getApp()
var lineChart = null;
Page({
  data: {
    title: '财务报表',
    more_function_display: 'none',
    selected: 0,
  },
  finance_request: function () {
    var that = this
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'report/financeReport',
      data: {
        openid: app.globalData.openid,
        // timeFrom: new Date((new Date(Date.now() - 864000000000))),
        // timeTo: new Date,
        payCate: that.data.payCate,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res.data)
        var data = [{
          name: '销售收入',
          value: res.data.saleIncome
        }, {
          name: '销售支出',
          value: res.data.salePay
        }, {
          name: '采购收入',
          value: res.data.purchaseIncome
        }, {
          name: '采购支出',
          value: res.data.purchasePay
        }, {
          name: '客户还款',
          value: res.data.customerRepay
        }, {
          name: '供货还款',
          value: res.data.suppierRepay
        }, {
          name: '费用收入',
          value: res.data.feeIncome
        }, {
          name: '费用支出',
          value: res.data.feePay
        }, {
          name: '-合计-',
          value: res.data.days
        }]
        that.setData({
          data: data
        })
      }
    })
  },

  // 打开多功能键
  more_function: function () {
    this.setData({
      more_function_display: "block",
    })
    setTimeout(() => {
      this.setData({
        animation: "animation",
      })
    }, 10)
  },
  // 关闭多功能键
  more_function_close: function () {
    this.setData({
      animation: "",
    })
    setTimeout(() => {
      this.setData({
        more_function_display: "none",
      })
    }, 300)
  },
  // 选择时间
  select: function (e) {
    this.setData({
      selected: e.target.dataset.index
    })
    this.updateData(e.target.dataset.index)
  },
  onLoad: function (e) {
    this.setData({
      payCate: e.payType
    })
    this.finance_request()
  }
})