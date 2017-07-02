var util = require('../../../../utils/util.js')
var wxCharts = require('../../../../utils/wxcharts.js')
var app = getApp()
var pieChart = null;
Page({
  data: {
    title: '采购分析',
    more_function_display: 'none',
    selected: 0,
    data: [
      [{ name: '裤子', data: 50, color: "#FF8500" }, { name: '衣服', data: 40, color: "#8AE3DD" }, { name: '其他', data: 10, color: "#DDDDDD" }], [{ name: '裤子', data: 361, color: "#FF8500" }, { name: '衣服', data: 305, color: "#8AE3DD" }, { name: '其他', data: 100, color: "#DDDDDD" }], [{ name: '裤子', data: 1230, color: "#FF8500" }, { name: '衣服', data: 863, color: "#8AE3DD" }, { name: '其他', data: 324, color: "#DDDDDD" }], [{ name: '裤子', data: 3452, color: "#FF8500" }, { name: '衣服', data: 1963, color: "#8AE3DD" }, {
        name: '其他', data: 526, color: "#DDDDDD"
      }]
    ],
    beginTime: "",//开始时间
    endTime: ""//结束时间
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
    var object = util.api.tiemFilter(e);
    object.selected = e.target.dataset.index;
    this.setData(object);
    this.updateData(e.target.dataset.index)
  },
  updateData: function (p) {
    
    var data = this.data.data
    pieChart.updateData({
      series: data[p]
    });
  },
  touchHandler: function (e) {
    pieChart.showToolTip(e, {
      // background: '#7cb5ec'
    });
    console.log(pieChart.getCurrentDataIndex(e));
    var title
    var content = this.data.data[this.data.selected][pieChart.getCurrentDataIndex(e)].data
    switch (pieChart.getCurrentDataIndex(e)){
      case (0):
        title = '衣服';
        break;
      case (1):
        title = '裤子';
        break;
      case (2):
        title = '其他';
        break;
    }
    wx.showModal({
      title: title,
      content: content+'件',
    })
  },

  // 创建报表
  chart: function () {
    pieChart = new wxCharts({
      animation: true,
      canvasId: 'pieCanvas',
      type: 'pie',
      series: [{
        name: '裤子',
        data: 50,
        color: "#FF8500"
      }, {
        name: '衣服',
        data: 40,
        color: "#8AE3DD"
      }, {
        name: '其他',
        data: 10,
        color: "#DDDDDD"
     }],
      width: 375,
      height: 300,
      dataLabel: true,
      extra:{
        pie: {
          offsetAngle: "-90"
        }
      }
    });
  },
  onLoad: function (e) {
    var myDate = new Date();
    var Time = util.toDate(myDate);
    this.setData({
      beginTime: Time + " 00:00:00",
      endTime: Time + " 23:23:23",
    })
    this.chart()
  }
})