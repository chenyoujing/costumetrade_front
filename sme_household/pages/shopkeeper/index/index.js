var util = require('../../../utils/util.js')
var wxCharts = require('../../../utils/wxcharts.js')
var app = getApp()
var columnChart = null;
Page({
  data: {
    userInfo:"",
    scanModal: true,
  },
  setdata: function (data) {
    this.setData(data)
  },
  scan:function(){
    var that = this
    util.api.scan(1, that.setdata)
  },
  cancel:function(){
    this.setData({
      scanModal: true,
    })
  },
  // 扫描成功的回调
  callback: function (data) {
    app.addCustomerInfo = data
    wx.navigateTo({
      url: '../../original/client/clientAdd/clientAdd?client=1&clientId=' + this.data.id + "&scan=" + true
    })
  },
  // 扫好了
  scanOk: function () {
    var that = this
    util.api.scanOk(1, that.data.id, this.callback)
    this.cancel()
  },
  chart: function () {
    var that = this
    var report = this.data.report.productReportQuerys
    var report_quantity = []
    var report_date = [];
    var today = {};
    for (var p in report){
      report_date.push(parseInt(p)+1)
      report_quantity.push(report[p].quantity||0)
    }
    today.quantity = report[report.length-1].quantity || 0
    today.amount = report[report.length - 1].amount || 0
    today.profit = ((report[report.length - 1].amount || 0) - (report[report.length - 1].primeCost||0)).toFixed(1);
    this.setData({
      today: today
    })
    wx.getSystemInfo({
      success: function (res) {
        var width = res.windowWidth
        columnChart = new wxCharts({
          canvasId: 'columnCanvas',
          type: 'column',
          categories: report_date,
          animation: true,
          background: '#52CAC1',
          legend: false,
          series: [{
            name: "销量",
            data: report_quantity,
            color: '#52CAC1'
          }],
          xAxis: {
            disableGrid: true
          },
          yAxis: {
            title: '数量（件）',
            min: 0,
          },
          width: width*0.75,
          height: 150,
          dataLabel: true,
          dataPointShape: true,
          extra: {
            columnStyle: 'straight'
          }
        });
      }
    });
  },

  onLoad: function (options) {
    this.setData({
      report: app.globalData.report
    })
    if (!app.logisticFees && app.globalData.userIdentity !== 2) {
      util.api.getProductInit()
    }
    this.chart()

  },
  onShow:function(){
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  onReady: function(){
    this.setData({
      userInfo: app.globalData.userInfo
    })
  }
})