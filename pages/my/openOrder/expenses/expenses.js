var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    more_function_display: "none",
    product:[],
    totalNum: 0,
    totalMoney: 0,
    accountModal: true,
  },
  // 打开入账模态框
  account:function(){
    this.setData({
      accountModal: false
    })
  },
  // 关闭入账模态框
  cancel: function () {
    this.setData({
      accountModal: true
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
  // 显示
  showInput:function(e){
    var index = e.target.dataset.index;
    var product = this.data.product;
    product[index].boolean = false;
    for (var p in product){
      product[p].focus = false;
    }
    product[index].focus = product[index].boolean?false:true;
    console.log(product[index].focus)
    this.setData({
      product:product
    })
  },
  EventHandle:function(e){
    var index = e.target.dataset.index;
    var product = this.data.product;
    product[index].value = e.detail.value;
    this.setData({
      product: product
    })
    console.log(product)
    this.total()
  },
  // 计算数量
  total:function(){
    var product = this.data.product;
    var totalNum = 0;
    var totalMoney = 0;
    for (var p in product) {
      if(product[p].value>0){
        totalNum +=1;
        totalMoney += parseInt(product[p].value);
      }
    }
    this.setData({
      totalNum: totalNum,
      totalMoney:totalMoney
    })
  },
  // 请求数据
  getDataAjax:function(){
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'order/orderFeeInit',
      data: {
        openid: app.globalData.openid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        for(var p in res.data){
          res.data[p].boolean = true;
          res.data[p].focus = false;
        }
        res.data[0].boolean = false;
        res.data[0].focus = true;
        that.setData({
          product: res.data
        })
      }
    })
  },
  submitData:function(){
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'order/saveOrderFee',
      data: {
        openid: app.globalData.openid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
       
      }
    })
  },
  onLoad:function(){
    this.getDataAjax()
  }
})