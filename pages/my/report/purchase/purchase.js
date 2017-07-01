var util = require('../../../../utils/util.js')
var wxCharts = require('../../../../utils/wxcharts.js')
var app = getApp()
var lineChart = null;
Page({
  data: {
    title:'采购报表',
    more_function_display: 'none',
    selected: 0
  },
  purchase_request: function () {
    var that = this
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'report/purchaseReport',
      data: {
        openid: app.globalData.openid,
        // timeFrom: new Date((new Date(Date.now() - 864000000000))),
        // timeTo: new Date,
        reportType: that.data.payCate,
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
  select:function(e){
    this.setData({
      selected: e.target.dataset.index
    })
    this.updateData(e.target.dataset.index)
  },
  updateData: function (p) {
    var data = [
      [10, 10, 5, 30, 25, 25, 20, 10], 
      [35, 40, 82, 46, 78, 62, 45, 70], 
      [57, 56, 27, 68, 90, 12, 57],
      [24, 45, 34, 21, 70, 46, 36]
    ]
    var categories = [
      ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
      ['7日前', '6日前', '5日前', '4日前', '3日前', '2日前', '1日前', '今日'],
      ['30日前', '25日前', '20日前', '15日前', '10日前', '5日前', '今日'],
      ['90日前', '75日前', '60日前', '45日前', '30日前', '15日前', '今日'],
    ]
    var series = [{
      name: '入库量',
      data: data[p],
      color: "#52CAC1"
    }];
    lineChart.updateData({
      categories: categories[p],
      series: series
    });
  },
  touchHandler: function (e) {
    lineChart.showToolTip(e, {
      // background: '#7cb5ec'
    });
  },    

  // 创建报表
  chart:function(){
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
      animation: true,
      background: '#52CAC1',
      legend: false,
      series: [{
        name: '入库量',
        data: [10, 10, 5, 30, 25, 25, 20, 10],
        color: "#52CAC1"
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '入库数量 (件)',
        min: 0
      },
      width: 375,
      height: 200,
      dataLabel: true,
      dataPointShape: true,
      extra: {
        lineStyle: 'straight'
      }
    });
  },
  onLoad: function (e) {
    this.purchase_request()
    this.chart()
  }
})