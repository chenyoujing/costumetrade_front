var app = getApp()
Page({
  data: {
    container_width: "100%",
    image_width: "115",
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this
  },
  rank: function () {
    var that = this
    if (!this.data.rank) {
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            image_width: res.windowWidth / 2 - 20,
            rank: 'rank'
          })
        }
      })
    } else {
      that.setData({
        image_width: "115",
        rank: ''
      })
    }
  },
  goods_detail: function (e) {
    let data = e.target.dataset
    console.log(data.orderid)
  },
  onShareAppMessage: function () {
    return {
      title: 'XXX店铺的推荐',
    }
  }

})
