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
    timebool:1,
    beginTime: "",//开始时间
    endTime: ""//结束时间
  },
  updateData: function () {
    var series = this.data.data.invReportQuerys;
    console.log(series)
    pieChart.updateData({
      series: series
    });
  },

  purchase_request: function () {
    var that = this
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'report/purchaseAnalysisReport',
      data: {
        openid: app.globalData.openid,
        timeFrom: that.data.beginTime + " 00:00:00",
        timeTo: that.data.endTime + " 23:59:59",
        filter: { field: "productName", value: null },
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res.data)
        that.setData({
          data: res.data
        })
      }
    })
    this.updateData()
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
  // 选择时间 select
  select: function (e) {
    var object = util.api.tiemFilter(e);
    object.selected = e.target.dataset.index;
    this.setData(object);
    this.data.selected != 4 ? this.purchase_request() : ''
  },
  // 时间改变
  timeChange: function (e) {
    var object = util.api.timeChange(e, this.data.beginTime, this.data.endTime);
    this.setData(object)
  },
  // 打开筛选界面
  screen:function(){
    this.setData({
      screen: 'screen'
    })
  },
  screen_colse:function(){
    this.setData({
      screen: ''
    })
  },
  // 改变入库、出库、往来款项
  changeType: function (e) {
    var type = e.currentTarget.dataset.type;
    this.setData({
      changeType: type
    })
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
      legend: false,
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
      beginTime: Time,
      endTime: Time,
    })
    this.chart()
    this.purchase_request()
  }
})