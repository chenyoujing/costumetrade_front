var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    items: [
      { name: 'USA', value: '进货价格' },
      { name: 'CHN', value: '客户' },
      { name: 'BRA', value: '供应商' },
      { name: 'JPN', value: '报表' },
    ],
    goods_level: [
      { name: 'USA', value: '处理' },
      { name: 'CHN', value: '促销' },
      { name: 'BRA', value: '在销' },
      { name: 'JPN', value: '热销' },
      { name: 'USA', value: '最新' },
    ],
    goods_level2: [
      { name: 'USA', value: '普通会员' },
      { name: 'CHN', value: '银卡会员' },
      { name: 'BRA', value: '金卡会员' },
      { name: 'JPN', value: '白金会员' },
      { name: 'USA', value: '钻石会员' },
    ],
    goods_level3: [
      { name: 'USA', value: '90%' },
      { name: 'CHN', value: '80%' },
      { name: 'BRA', value: '70%' },
      { name: 'JPN', value: '60%' },
      { name: 'USA', value: '50%' },
    ],
    current: "0",
    dictionary: "1",
    staff_updata: "100%",
  },
  onLoad: function() {
    var that = this
  },
  swiper_change: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  dictionarytype: function (e) {
    var that = this
    let data = e.target.dataset
    this.setData({
      current: data.dictionary,
    })
  },
  staff_updata: function (e) {
    this.setData({
      staff_updata: "0"
    })
  },
  staff_updata_close: function (e) {
    this.setData({
      staff_updata: "100%"
    })
  },
})