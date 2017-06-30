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
  }
})