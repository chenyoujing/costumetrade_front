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
    sort: { value: "quantityOp", op: "des" },
    filter: { field: "productName", value: null },
    reportType:1,
    quantityOp: { value:"quantityOp",op:"des"},
    amountOp: { value: "amountOp", op: "des" },
    categories:[],
    data1:[],
    product: [],
    pageNum:1,
    hasMore: true
  },
  purchase_request: function () {
    var that = this
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'report/purchaseReport',
      data: {
        openid: app.globalData.openid,
        timeFrom: that.data.beginTime +  " 00:00:00",
        timeTo: that.data.endTime + " 23:59:59",
        reportType: that.data.reportType,
        filter: that.data.filter,
        rules: that.data.rules,
        sort:that.data.sort,
        pageNum: that.data.pageNum
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var productReportQuerys = res.data.productReportQuerys;
        var categories = that.data.pageNum==1?[]: that.data.categories;
        var dataReport = that.data.pageNum == 1 ? [] : that.data.dataReport;
        var hasMore = false;
        if (res.data.purchaseReportQuerys){
          hasMore = res.data.purchaseReportQuerys.length > 10 ?true:false
        }
        for (var p in productReportQuerys){
          var time = '';
          productReportQuerys[p].timeTo = util.formatTime(new Date(productReportQuerys[p].timeTo));
          time = productReportQuerys[p].timeTo.split(" ")[1];
          categories.push(time);
          dataReport.push(productReportQuerys[p].quantity || 0 );
        }
        if (categories.length >0){
          that.chart(dataReport, categories)
        }
        that.setData({
          product: res.data.purchaseReportQuerys||[],
          categories: categories,
          dataReport: dataReport,
          hasMore: hasMore,
          'filter.value': res.data.purchaseReportQuerys.length>0 ? res.data.purchaseReportQuerys[0].productName:null
        })
      }
    })
  },
  goNext: function () {
    this.setData({
      pageNum: this.data.pageNum += 1
    })
    this.purchase_request();
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
    object.selected = e.target.dataset.index;
    this.setData(object);
    this.purchase_request()
  },
  // 时间改变
  timeChange: function (e) {
    var object = util.api.timeChange(e, this.data.beginTime, this.data.endTime);
    this.setData(object);
    this.purchase_request()
  },    
  // 选择某个商品
  selectGoods:function(e){
    var name = e.currentTarget.dataset.name;
    var filter = this.data.filter;
    console.log(e)
    filter.value = name;
    this.setData({
      filter:filter
    })
    this.purchase_request()
  },
  // 创建报表
  chart: function (data1,categories){
    var that = this;
    lineChart = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'line',
      categories:categories,
      animation: true,
      background: '#52CAC1',
      legend: false,
      series: [{
        name: that.data.reportTitle,
        data: data1,
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
    
  },
  onShow:function(){
    if (app.getFilterData || app.searchValue) {
      this.setData({
        pageNum: 1,
        product: [],
        "filter.value": app.searchValue ? app.searchValue : null,
        rules: app.getFilterData ? app.getFilterData : undefined
      })
      this.purchase_request();
      app.getFilterData = [];
    }
  }
})