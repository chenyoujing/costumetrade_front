var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    more_function_display: "none",
    product:[],
    totalNum: 0,
    totalMoney: 0,
    accountModal: true,
    saveOrderFee:[],
    paycact:'现金'
  },
  // 打开入账模态框
  account:function(){
    this.setData({
      accountModal: false
    });
    
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
    var saveOrderFee = this.data.saveOrderFee;
    var object = {
      storeid:1,
      cate:e.target.dataset.id,
      catename: e.target.dataset.text,
      paycate:"",
      paycost:""
    }
    saveOrderFee.push(object)
    this.setData({
      saveOrderFee: saveOrderFee
    })
  },
  EventHandle:function(e){
    var index = e.target.dataset.index;
    var saveOrderFee = this.data.saveOrderFee;
    saveOrderFee[index].paycost = e.detail.value;
    this.setData({
      saveOrderFee: saveOrderFee
    })
    console.log(saveOrderFee)
    this.total()
  },
  
  // 计算数量
  total:function(){
    var saveOrderFee = this.data.saveOrderFee;
    var totalNum = 0;
    var totalMoney = 0;
    for (var p in saveOrderFee) {
      if (saveOrderFee[p].paycost>0){
        totalNum +=1;
        totalMoney += parseInt(saveOrderFee[p].paycost);
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
  // 取消操作
  canleSubmit:function(){
    var saveOrderFee = this.data.saveOrderFee;
    for (var p in saveOrderFee) {
      saveOrderFee[p].paycost = "";
    } 
    this.setData({
      saveOrderFee: saveOrderFee
    })
  },
  // 提交订单
  submitData:function(){
    var that = this;
    var saveOrderFee = this.data.saveOrderFee;
    for (var p in saveOrderFee){
      saveOrderFee[p].paycate = this.data.paycact;
    }
    console.log(saveOrderFee)
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'order/saveOrderFee',
      data: saveOrderFee,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.showToast({
          title: 'ok',
          mask: true,
          duration: 2000
        })
      }
    })
  },
  onLoad:function(){
    this.getDataAjax();
  }
})