// pages/grid/shop/orderSure/orderSure.js
Page({
  data: {
  
  },
  address:function(){
    wx.chooseAddress({
      success: function (res) {
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })
  },
  orderSure:function(){
    wx.showModal({
      title: '是否下订单',
      success: function (res) {
        if (res.confirm) {
          wx.showToast({
            title: '下单成功',
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        } else if (res.cancel) {}
      }
    })
  },
  onLoad: function (options) {
  
  },
})