var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
  
  },
  // 保存地址
  add_function:function(){
    var that = this
    wx.chooseAddress({
      success: function (res) {
        var data = {
          openid: app.globalData.openid,
          contact: res.userName,
          phone: res.telNumber,
          address: res.detailInfo,
          province: res.provinceName,
          city: res.cityName,
          district: res.countyName,
        }
        util.api.request({
          url: 'user/saveAddress',
          data: data,
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            wx.hideNavigationBarLoading();
            wx.showToast({
              title: '保存成功',
            })
            var address = that.data.address||[]
            address.push(data)
            that.setData({
              address: address
            })
          }
        })
      }
    })
  },
  // 读取地址
  address_request:function(){
    var that = this
    util.api.request({
      url: 'user/getAddressList',
      data: {
        openid: app.globalData.openid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        that.setData({
          address:res.data
        })
      }
    })
  },

  onLoad:function(){
    this.address_request()
  }
})