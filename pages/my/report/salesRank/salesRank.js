var util = require('../../../../utils/util.js')
var wxCharts = require('../../../../utils/wxcharts.js')
var app = getApp()
var columnChart = null;
Page({
  data: {
    title: '销售排行',
    more_function_display: 'none',
    selected: 0,
    categories: ['连衣裙', '报喜鸟', '衬衣'],
    beginTime: "",//开始时间
    endTime: "",//结束时间
    timebool: 1,//确定显示按钮还是input
    filter: { field: "productName", value: null },
    thTitle:"货品名称",
    sort: {},
    reportType: 1,
    quantityOp: { value: "quantityOp", op: "des" },
    amountOp: { value: "amountOp", op: "des" },
    pageNum:1
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
    console.log(object)
    this.setData(object);
  },
  // 时间改变
  timeChange:function(e){
    var object = util.api.timeChange(e, this.data.beginTime, this.data.endTime);
    this.setData(object)
  },
  // 改变品牌、种类....
  batchType:function(e){
    var type = e.currentTarget.dataset.type;
    var filter = this.data.filter;
    filter.field = type;
    this.setData({
      filter: filter
    })
    this.chart();
  },
  // 改变排序方法
  sort: function (e) {
    var name = e.target.dataset.name;
    var object = this.data[name];
    var param = {};
    object.op = object.op == "des" ?"asc" :"des";
    param[name] = object;
    param.sort = object;
    this.setData(param)
  },
  updateData: function (p) {
    var that = this
    var data = [
      [5, 1, 3],
      [30, 25, 31],
      [150, 102, 140],
      [520, 420, 560]
    ]
    var series = [{
      name: '销售量',
      data: data[p],
      color: "#52CAC1"
    }];
    columnChart.updateData({
      categories: that.data.categories,

      series: series
    });
  },
  touchHandler: function (e) {
    var that = this
    var index = columnChart.getCurrentDataIndex(e);
    if (index > -1 && index < that.data.categories.length) {
      columnChart.updateData({
        type: 'line',
        categories: ['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
        series: [{
          name: that.data.categories[index],
          data: [10, 10, 5, 30, 25, 25, 20, 10],
        }]
      });
    }
  },
  
  // 创建报表
  chart: function () {
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: "report/saleSortReport",
      data: {
        openid: app.globalData.openid,
        timeFrom: that.data.beginTime + " 00:00:00",
        timeTo: that.data.endTime + " 23:59:59",
        filter: that.data.filter,
        sort: that.data.sort,
        pageNum: that.data.pageNum
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
       console.log(res.data)
        wx.hideNavigationBarLoading();
        wx.showToast({
          title: "添加成功！",
          mask: true,
          duration: 2000
        })
      }
    })
   
  },
  chartShow:function(){
    var that = this;
    columnChart = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      categories: that.data.categories,
      animation: true,
      background: '#52CAC1',
      legend: false,
      series: [{
        name: '销售量',
        data: [5, 1, 3],
        color: "#52CAC1"
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '销售数量 (件)',
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
    var myDate = new Date();
    var Time = util.toDate(myDate);
    this.setData({
      beginTime: Time,
      endTime: Time,
    })
    this.chart()
  }
})