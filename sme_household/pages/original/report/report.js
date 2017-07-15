var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data:{
    more_function_display: 'none'

  },
  canvas: function () {
    var that = this
    // wx.showNavigationBarLoading()
    // util.api.request({
    //   url: 'report/financeReport',
    //   data: {
    //     openid: app.globalData.openid,
    //     // timeFrom: new Date((new Date(Date.now() - 864000000000))),
    //     // timeTo: new Date,
    //     payCate: 'CASH_PAY',
    //   },
    //   method: 'POST',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   success: function (res) {
    //     wx.hideNavigationBarLoading();
    //     console.log(res.data)
    //   }
    // })
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

  onLoad:function(){
    this.canvas()
  }
})