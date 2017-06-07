var util = require('../../../../utils/util.js')
var app = getApp()
Page({

  data: {
    accounttype:'0',
    billtype: ["收客户欠款", "换供货欠款", "应收调账", "应付调账"],
    billtype_index: 0,
    paytype: ["现金", "刷卡", "微信", "支付宝", "农业银行", "工商银行", "广发银行", "招商银行", "中信银行", "华夏银行", "建设银行"],
    paytype_index: 0,

  },


  accounttype: function (e) {
    var that = this
    let data = e.target.dataset
    that.setData({
      accounttype: data.accounttype
    })
  },
  startDateChange: function (e) {
    this.setData({
      date_start: e.detail.value
    })
  },
  endDateChange: function (e) {
    this.setData({
      date_end: e.detail.value
    })
  },
  account_date: function (e) {
    this.setData({
      account_date: e.detail.value
    })
  },
  swiper_change: function (e) {
    this.setData({
      accounttype: e.detail.current
    })
  },
  billtypePicker: function (e) {
    this.setData({
      billtype_index: e.detail.value
    })
  },
  paytypePicker: function (e) {
    this.setData({
      paytype_index: e.detail.value
    })
  },
  zero: function () {
    this.setData({
      zero: "0"
    })
  },
  goods: function (e) {
    var that = this
    let data = e.target.dataset
    this.setData({
      goods: "0",
    })
  },
  onLoad: function (options) {
    this.setData({
      date_start: util.formatTime(new Date(Date.now() - 86400000)),
      date_end: util.formatTime(new Date(Date.now())),
      account_date: util.formatTime(new Date(Date.now())),
    })

  },

})