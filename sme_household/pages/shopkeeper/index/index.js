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
    util.api.scan(1, that.setData())
  },
  chart: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.width = res.windowWidth
      }
    })
    var that = this;
    columnChart = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      categories: ['1', '2', '3', '4', '5', '6', '7'],
      animation: true,
      background: '#52CAC1',
      legend: false,
      series: [{
        name: "s",
        data: [10, 10, 5, 30, 25, 25, 20],
        color: '#52CAC1'
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '数量（件）',
        min: 0,
      },
      width: that.width*0.75,
      height: 150,
      dataLabel: true,
      dataPointShape: true,
      extra: {
        columnStyle: 'straight'
      }
    });
  },

  onLoad: function (options) {
    if (!app.logisticFees && app.globalData.userIdentity !== 2) {
      util.api.getProductInit()
    }
    this.setData({
      userInfo: app.globalData.userInfo
    })
    this.chart()
  },
  onReady: function(){
    this.setData({
      userInfo: app.globalData.userInfo
    })
  }
})