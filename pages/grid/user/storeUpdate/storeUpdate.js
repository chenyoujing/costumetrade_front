// pages/grid/user/storeUpdate/storeUpdate.js
Page({

  /**
   * 页面的初始数据
   */
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
  }
})