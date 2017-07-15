var util = require('../../../../utils/util.js')
var wxCharts = require('../../../../utils/wxcharts.js')
var app = getApp()
var pieChart = null;
Page({
  data: {
    title: '采购分析',
    more_function_display: 'none',
    selected: 0,
    filter:{ field: "productName", value: null },
    invReportQuerys:[],//库存
    purchaseQuerys:[],//销售
    timebool:1,
    total2:0,
    total1:0,
    name: "productName",
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
  // 改变品牌、种类....
  batchType: function (e) {
    var type = e.currentTarget.dataset.type;
    var filter = this.data.filter;
    var name = e.target.dataset.name;
    console.log(name)
    filter.field = type;
    this.setData({
      filter: filter,
      name: type
    })
    this.purchase_request();
  },
  purchase_request: function () {
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: that.data.url,
      data: {
        openid: app.globalData.openid,
        timeFrom: that.data.beginTime + " 00:00:00",
        timeTo: that.data.endTime + " 23:59:59",
        filter: that.data.filter
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res.data);
        if (that.data.title == "采购分析"){
          that.setData({
            invReportQuerys: that.filterData(res.data.invReportQuerys, "quantity",1),//库存 
            purchaseQuerys: that.filterData(res.data.purchaseQuerys, "quantity",2)//销售
          });
          if (that.data.invReportQuerys.length > 0 && that.data.total1 > 0){
            that.chart(that.data.invReportQuerys,"pieCanvas")
          }
          if (that.data.purchaseQuerys.length > 0 && that.data.total2 > 0) {
            that.chart(that.data.purchaseQuerys,"pieCanvas2")
          }
        }else{
          that.setData({
            saleAmount: res.data.saleAmount,//总额
            profitAmount: res.data.profitAmount,//利润
            pucharseAmount: res.data.pucharseAmount,//成本
            grossProfit: res.data.grossProfit,
            pucharseProfit: Number(res.data.pucharseAmount) / Number(res.data.saleAmount) ,//成本利润
            invReportQuerys: that.filterData(res.data.querys, "profitAmount", 1),//利润 
            purchaseQuerys: that.filterData(res.data.querys, "saleAmount", 2)//销售额
          });
          if (that.data.invReportQuerys.length > 0 && that.data.total1>0) {
            that.chart(that.data.invReportQuerys, "pieCanvas")
          }
          if (that.data.purchaseQuerys.length > 0 && that.data.total2 > 0) {
            that.chart(that.data.purchaseQuerys, "pieCanvas2")
          }
        }
      }
    })
  },
// 数据过滤
  filterData: function (data1,quantity,num){
    console.log(this.data.name)
    var newdata = [];
    var total = 0;
    var name1 = 'total1';
    var param = {};
    for (var p in data1){
      var object = {};
      if (data1[p][quantity] < 0){
        data1[p][quantity] = 0;
      }
      total += data1[p][quantity];
      object.data = data1[p][quantity];
      object.name = data1[p][this.data.name] || "无名";
      newdata.push(object);
    }
    name1 = num == 1 ? 'total1' : 'total2';
    param[name1] = total;
    this.setData(param);
    return newdata;
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
  // 创建报表
  chart: function (data1, canvasId) {
    pieChart = new wxCharts({
      animation: true,
      canvasId: canvasId,
      type: 'pie',
      legend: true,
      series: data1,
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
      url: e.url,
      title:e.title
    })
    this.purchase_request(e.url)
  }
})