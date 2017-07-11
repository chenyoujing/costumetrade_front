var util = require('../../../../utils/util.js')
var wxCharts = require('../../../../utils/wxcharts.js')
var app = getApp()
var lineChart = null;
Page({
  data: {
    title:'入库报表',
    reportTitle:"入库数量",
    more_function_display: 'none',
    selected: 0,
    beginTime: "",//开始时间
    endTime: "",//结束时间
    timebool: 1,//确定显示按钮还是input
    rules:[],
    sort: {},
    reportType:1,
    quantityOp: { value:"quantityOp",op:"des"},
    amountOp: { value: "amountOp", op: "des" },
    categories:[],
    data:[]
  },
  purchase_request: function () {
    var that = this
    console.log(JSON.stringify({
      openid: app.globalData.openid,
      timeFrom: that.data.beginTime,
      timeTo: that.data.endTime,
      reportType: that.data.reportType,
      filter: { field: "productName", value: null },
      rules: [],
      sort: that.data.sort
    }))
    
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'report/purchaseReport',
      data: {
        openid: app.globalData.openid,
        timeFrom: that.data.beginTime,
        timeTo: that.data.endTime,
        reportType: that.data.reportType,
        filter: { field: "productName", value: null },
        rules:[],
        sort:that.data.sort
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res.data)
       
        that.setData({
          data: res.data,
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
  // 过滤框按钮
  bindFaous: function () {
    wx.navigateTo({
      url: '../../../my/Goods/GoodsScreen/GoodsScreen?type=report'
    })
  },
  // 选择时间
  select: function (e) {
    var object = util.api.tiemFilter(e);
    console.log(object)
    object.selected = e.target.dataset.index;
    this.setData(object);
  },
  // 时间改变
  timeChange: function (e) {
    var object = util.api.timeChange(e, this.data.beginTime, this.data.endTime);
    this.setData(object)
  },
  // 改变入库、出库、往来款项
  changeType: function (e) {
    var type = e.currentTarget.dataset.type;
    this.setData({
      changeType: type
    })
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
      name: this.data.reportTitle,
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
  // 改变排序方法
  sort:function(e){
    var name = e.target.dataset.name;
    var object = this.data[name];
    var param = {};
    object.op  = object.op == "des" ?  "asc" : "des";
    param[name] = object;
    param.sort = object;
    this.setData(param);
    console.log(param)
    this.purchase_request()
  },
  // 创建报表
  chart:function(){
    var that = this;
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: that.data.categories||['8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
      animation: true,
      background: '#52CAC1',
      legend: false,
      series: [{
        name: that.data.reportTitle,
        data: [10, 10, 5, 30, 25, 25, 20, 10],
        color: "#52CAC1"
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: that.data.reportTitle,
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
  // 报表显示名称
  reportName: function (reportType){
    var reportTitle = "";
    var title = "";
    if (reportType == 1) {
        reportTitle = '入库数量';
        title = "采购报表";
    } else if (reportType == 2){
      reportTitle = "成交数量";
      title = "销售报表";
    }else{
      reportTitle = "成交数量";
      title = "会员报表";
    };
    this.setData({
      reportTitle: reportTitle,
      title: title
    })
  },
  onLoad: function (e) {
    var myDate = new Date();
    var Time = util.toDate(myDate);
    this.setData({
      beginTime: Time,
      endTime: Time,
      reportType: e.reportType
    })
    this.reportName(e.reportType)
    this.purchase_request()
    this.chart()
  }
})