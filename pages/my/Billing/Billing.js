// pages/my/Billing/Billing.js
Page({
  data: {
    scroll_height: "",
    toView: 'blue',
  },
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scroll_height:res.windowHeight
        })
      }
    })
  },
})