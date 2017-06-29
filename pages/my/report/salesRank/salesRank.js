var util = require('../../../../utils/util.js')
var wxCharts = require('../../../../utils/wxcharts.js')
var app = getApp()
var columnChart = null;
Page({
  data: {
    title: '销售排行',
    more_function_display: 'none',
    selected: 0
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
    columnChart.updateData({
      categories: categories[p],
      series: series
    });
  },
  touchHandler: function (e) {
    columnChart.showToolTip(e, {
      // background: '#7cb5ec'
    });
  },

  // 创建报表
  chart: function () {
    columnChart = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
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
        columnStyle: 'straight'
      }
    });
  },
  onLoad: function (e) {
    this.chart()
  }
})