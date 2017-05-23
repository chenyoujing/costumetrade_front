var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    items: [
      { name: 'USA', value: '进货价格' },
      { name: 'CHN', value: '客户' },
      { name: 'BRA', value: '供应商' },
      { name: 'JPN', value: '报表' },
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
  }
})