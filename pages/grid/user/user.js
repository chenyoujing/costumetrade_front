var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data:{},
  goto_info: function (e) {
    app.infotype = e.target.dataset.infotype
    wx.switchTab({
      url: '../info/info',
    })
  },
})