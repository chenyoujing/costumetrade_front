var util = require('../../../../utils/util.js')
var wxCharts = require('../../../../utils/wxcharts.js')
var app = getApp()
var columnChart = null;
Page({
  data: {
    title: '库存报表',
    more_function_display: 'none',
    rules: [],
    sort: { value: "quantityOp", op: "desc" },
    filter: { field: "productName", value: null },
    hasMore:false
  },
  // 下一页上一页
  goNext: function () {
    this.setData({
      pageNum: this.data.pageNum += 1
    })
    this.stock_request();
  },
  stock_request: function () {
    var that = this
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'report/realTimeInventory',
      data: {
        openid: app.globalData.openid,
        filter: that.data.filter,
        rules: that.data.rules,
        sort: that.data.sort
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var data = typeof (res.data) == "Array" ? res.data:[];
        that.setData({
          product: data,
          hasMore: data == 10 ? true : false
        })
      }
    })
  },
  // 改变排序方法
  sort: function (e) {
    var name = e.target.dataset.name;
    var object = this.data.sort;
    var param = {};
    object.op = object.op == "des" ? "asc" : "desc";
    param.sort = object;
    this.setData(param);
    this.stock_request()
  },
  // 过滤框按钮
  bindFaous: function () {
    wx.navigateTo({
      url: '../../../my/Goods/GoodsScreen/GoodsScreen?type=report'
    })
  },
  onLoad: function (e) {
    this.stock_request()
  },
  onShow:function(){
    if (app.getFilterData || app.searchValue) {
      var filter = this.data.filter;
      console.log(this.data.filter)
      filter.value = app.searchValue ? app.searchValue :null;
      this.setData({
        pageNum: 1,
        product: [],
        filter: filter,
        rules: app.getFilterData ? app.getFilterData : undefined
      })
      this.stock_request();
      app.getFilterData = [];
    }
  }
})