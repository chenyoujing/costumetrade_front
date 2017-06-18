var app = getApp()
Page({
  data: {
    container_width: "100%",
    image_width: "115",
  },
  // 跳转搜索页面
  bindfocus:function(){
    wx.navigateTo({
      url: '../mallScreen/mallScreen',
    })
    this.setData({
      inputFocus: false,
    })
  },
  changeSortData:function(){
  },
  rank: function () {
    var that = this
    if (!this.data.rank) {
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            image_width: res.windowWidth / 2 - 10,
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
  },
  onLoad: function () {
  },

})
