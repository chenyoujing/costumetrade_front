// pages/my/openOrder/goodsDetails/goodsDetails.js
Page({

  data: {
    keyboard_width:"",
    keyboard_height:"",
    color: ["藏青色", "玫红色"],
    size: ["S", "M"],
  },
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          keyboard_width: (res.windowWidth - 8) / 4 - 4,
          keyboard_height: res.windowHeight / 6 - 10
        })
      }
    })
  },
})