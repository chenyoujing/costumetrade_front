// pages/grid/shop/payOrder/payOrder.js
Page({
  data: {
    method:"0",
  },
  method: function (e){
    this.setData({
      method: e.target.dataset.method
    })
  },
  method_swiper: function (e){
    this.setData({
      method: e.detail.current
    })
  },
  pay: function (e){
    let data = e.target.dataset
    wx.showToast({
      title: '选择' + data.pay,
      icon: 'success',
      duration: 1000
    })
    setTimeout(() => {
      wx.reLaunch({
        url: '../shop'
      })
    }, 1000)
  }
})