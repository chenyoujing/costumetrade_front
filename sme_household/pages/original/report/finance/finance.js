var util = require('../../../../utils/util.js')
var wxCharts = require('../../../../utils/wxcharts.js')
var app = getApp()
var lineChart = null;
Page({
  data: {
    title: '财务报表',
    more_function_display: 'none',
    selected: 0,
    beginTime: "",//开始时间
    endTime: ""//结束时间
  },
  finance_request: function () {
    var that = this
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'report/financeReport',
      data: {
        openid: app.globalData.openid,
        timeFrom: that.data.beginTime + " 00:00:00",
        timeTo: that.data.endTime + " 23:59:59",
        payCate: that.data.payCate,
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
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
  onLoad: function (e) {
    var myDate = new Date();
    var Time = util.toDate(myDate);
    this.setData({
      beginTime: e.beginTime,
      endTime: e.endTime,
      payCate: e.payType
    })
    this.finance_request()
  }
})