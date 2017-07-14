//index.js
//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    ids: '',
    storeId: '',
    title:'',
    product:[]
  },
  // 获取选中的货品
  selected_goods: function () {
    var that = this;

    wx.login({
      success: function (loginCode) {
        wx.getUserInfo({
          success: function (res) {
            wx.showNavigationBarLoading()
            util.api.request({
              url: 'product/getShareProduct',
              data: {
                storeId: that.data.storeId,
                idArray: that.data.ids,
                appId: app.globalData.userInfo.appid,
                appSecret: app.globalData.userInfo.secret,
                code: loginCode.code,
                checkAllTag: that.data.checkAllTag,
                encryptedData: res.encryptedData,
                iv: res.iv,
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                wx.hideNavigationBarLoading();
                for (var p in res.data) {
                  res.data[p].timeUp = util.toDate(res.data[p].timeUp);
                  res.data[p].image = util.api.imgUrl + res.data[p].image
                }
                that.setData({
                  product: res.data
                })
                wx.showToast({
                  title: '成功',
                  mask: true,
                  duration: 2000
                })
              }
            })
          }
        })
      }
    })

  },
  onLoad: function (e) {
    this.setData({
      ids: e.ids,
      storeId: e.storeId,
      title: e.title,
      name:e.name,
      checkAllTag: e.checkAllTag
    })
    console.log(e)
    this.selected_goods();
  }
})
