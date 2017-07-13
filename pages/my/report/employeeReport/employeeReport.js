var util = require('../../../../utils/util.js')
var wxCharts = require('../../../../utils/wxcharts.js')
var app = getApp()
Page({
  data: {
    title: '员工销售排行',
    more_function_display: 'none',
    selected: 0,
    categories: ['连衣裙', '报喜鸟', '衬衣'],
    dataReport: [],
    beginTime: "",//开始时间
    endTime: "",//结束时间
    timebool: 1,//确定显示按钮还是input
    filter: { field: "createBy", value: null },
    thTitle: "员工名称",
    sort: { value: "quantityOp", op: "des" },
    reportType: 1,
    quantityOp: { value: "quantityOp", op: "des" },
    amountOp: { value: "amountOp", op: "des" },
    product:[],
    rules: []
  },
  // 选择时间
  select: function (e) {
    var object = util.api.tiemFilter(e);
    object.selected = e.target.dataset.index;
    this.setData(object);
    this.chart()
  },
  // 时间改变
  timeChange: function (e) {
    var object = util.api.timeChange(e, this.data.beginTime, this.data.endTime);
    this.setData(object);
    this.chart()
  },
  // 改变排序方法
  sort: function (e) {
    var name = e.target.dataset.name;
    var object = this.data[name];
    var param = {};
    object.op = object.op == "des" ? "asc" : "des";
    param[name] = object;
    param.sort = object;
    this.setData(param);
    this.chart()
  },
  // 过滤框按钮
  bindFaous: function () {
    wx.navigateTo({
      url: '../../../my/Goods/GoodsScreen/GoodsScreen?type=report'
    })
  },
  // 创建报表
  chart: function () {
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: "report/employeeReport",
      data: {
        openid: app.globalData.openid,
        timeFrom: that.data.beginTime + " 00:00:00",
        timeTo: that.data.endTime + " 23:59:59",
        filter: that.data.filter,
        sort: that.data.sort,
        rules: that.data.rules
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var categories =[];
        var dataReport = [];
        var name = that.data.sort.value == "quantityOp" ? "quantity" :"amount";
        for (var p in res.data.employeeQuerys){
          categories.push(res.data.employeeQuerys[p].createBy||" ");
          dataReport.push(res.data.employeeQuerys[p][name]);
        }
        that.setData({
          dataReport: dataReport,
          categories: categories,
          product: res.data.employeeQuerys
        });
        if (dataReport.length > 0){
          that.chartShow(dataReport, categories)
        }
        wx.showToast({
          title: "添加成功！",
          mask: true,
          duration: 2000
        })
      }
    })

  },
  chartShow: function (data1, categories) {
    var that = this;
    var columnChart = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      categories: categories,
      animation: true,
      background: '#52CAC1',
      legend: false,
      series: [{
        name: '销售量',
        data: data1,
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
  },
  onShow:function(){
   if (app.getFilterData || app.searchValue) {
      this.setData({
        pageNum: 1,
        product: [],
        "filter.value": app.searchValue ? app.searchValue : null,
        rules: app.getFilterData ? app.getFilterData : undefined
      })
      this.chart();
      app.getFilterData = [];
    }
  }
})