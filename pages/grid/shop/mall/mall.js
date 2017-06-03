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
    if (this.data.container_width == "100%") {
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            container_width: "50%",
            image_width: res.windowWidth / 2 - 20,
            text_position: "relative",
            text_left: "0",
            text_padding: "0 5px",
            title_padding: "5px 5px 0",
            info_padding: "0",
            info_border: "none",
          })
        }
      })
    } else {
      that.setData({
        container_width: "100%",
        image_width: "115",
        text_position: "absolute",
        text_left: "115px",
        text_padding: "",
        title_padding: "",
        info_padding: "",
        info_border: "",
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
