var util = require('../../../../utils/util.js')
var app = getApp()
Page({

  data: {
    counting: [],
    account: [],
    accounttype:'0',
    billtype: [
      { name: 1, value: "收客户欠款" },
      { name: 2, value: "还客户欠款" },
      { name: 3, value: "收供应商欠款" },
      { name: 4, value: "收供应商欠款" },
    ],
    billtype_index: 0,
    paytype: [
      { dictText: "微信", dictValue: "WEIXIN_PAY" },
      { dictText: "支付宝", dictValue: "ALI_PAY" }
    ],
    paytype_index: 0,
    date_start: '',
    date_end: '',
    account_date: "",
  },
  // 明细
  financialCounting:function(){
    var that = this
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'client/financialCounting',
      data: {
        clientId: that.data.clientId,
        openid: app.globalData.openid,
        timeFrom: new Date(Date.parse(this.data.date_start) - 28800000),
        timeTo: new Date(Date.parse(this.data.date_end) + 57600000 ),
        clientType: that.data.client
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res.data)
        var counting = res.data
        for (var p in counting){
          if(counting[p].orders){
            for (var j in counting[p].orders){
              counting[p].orders[j].ordertime = util.formatTime(new Date(counting[p].orders[j].ordertime))
            }
          } 
          if (!counting[p].payable) { 
            counting[p].payable = 0
          }
          if (!counting[p].receivableTotalAmount) {
            counting[p].receivableTotalAmount = 0
           }
        }
        that.setData({
          counting: counting
        })
      }
    })
  },
  // 还款 
  initAccountInfo:function(){
    var that = this
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'client/initAccountInfo',
      data: {
        clientId: that.data.clientId,
        openid: app.globalData.openid,
        timeFrom: new Date(that.data.account_date),
        clientType: that.data.client
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res.data)
        var account = res.data
        
        if(res.data.receivable >= res.data.payable){
          // 应收
          var price = res.data.receivable
        }else{
          // 应付
          var price = res.data.payable
        }
        that.setData({
          account: res.data,
          price: price,
          paytype: res.data.dictionarys
        })
      }
    })
  },
  // 新增还款单
  saveAccountInfo: function () {
    var that = this
    var reg = /^[1-9]\d*(\.\d+)?$/
    var boolean = true
    boolean = util.api.regular(that.data.price, reg, '请填入大于0的数字')
    if (boolean){
      wx.showNavigationBarLoading()
      util.api.request({
        url: 'client/saveAccountInfo',
        data: {
          clientId: that.data.clientId,
          storeid: app.globalData.storeId,
          payobjtype: that.data.account.payobjtype,
          payno: that.data.account.payno,
          paytype: that.data.paytype[that.data.paytype_index].dictValue,
          payamt: that.data.price,
          billtype: that.data.billtype[that.data.billtype_index].name,
          paytime: new Date,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.hideNavigationBarLoading();
          console.log(res.data)

          wx.showToast({
            title: '还款成功',
          })
          that.financialCounting()
          that.initAccountInfo()
        }
      })
    }
  },
  accounttype: function (e) {
    var that = this
    let data = e.target.dataset
    that.setData({
      accounttype: data.accounttype
    })
  },
  swiper_change: function (e) {
    this.setData({
      accounttype: e.detail.current
    })
  },
  // 明确时间改变
  startDateChange: function (e) {
    this.setData({
      date_start: e.detail.value
    })
    this.financialCounting()
  },
  endDateChange: function (e) {
    this.setData({
      date_end: e.detail.value
    })
    this.financialCounting()
  },
  // 还款时间
  account_date: function (e) {
    this.setData({
      account_date: e.detail.value
    })
    this.initAccountInfo()
  },
  // 单据类型下拉框
  billtypePicker: function (e) {
    this.setData({
      billtype_index: e.detail.value
    })
  },
  // 支付方式下拉框
  paytypePicker: function (e) {
    this.setData({
      paytype_index: e.detail.value
    })
  },
  // 清零
  zero: function () {
    this.setData({
      price: ""
    })
  },
  pirceinput:function(e){
    this.setData({
      price: e.detail.value
    })
  },
  onLoad: function (e) {
    var billtype = [
      { name: 1, value: "收客户欠款" },
      { name: 2, value: "还客户欠款" },
      { name: 3, value: "收供应商欠款" },
      { name: 4, value: "收供应商欠款" },
    ]
    switch (e.client){
      case ("1"):
        billtype = [
          { name: 1, value: "收客户欠款" },
          { name: 2, value: "还客户欠款" },
        ]
        break;
      case ("2"):
        billtype = [
          { name: 3, value: "收供应商欠款" },
          { name: 4, value: "收供应商欠款" },
        ]
        break;
    }
    
    this.setData({
      date_start: util.toDate(new Date(Date.now() - 86400000)),
      date_end: util.toDate(new Date(Date.now())),
      account_date: util.toDate(new Date(Date.now())),
      client:e.client,
      clientId:e.clientId,
      billtype: billtype,
    })
    this.financialCounting()
    this.initAccountInfo()
  },

})