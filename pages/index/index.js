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
    app.globalData.userInfo = {
      appid: 'wx82428b2ac752c6a3',
      secret: 'ed8c5aa16cf56f66339fcb4be3377e30'
    } 
    wx.login({
      success: function (loginCode) {
        wx.showNavigationBarLoading()
        util.api.request({
          url: 'product/getShareProduct',
          data: {
            storeId: that.data.storeId,
            idArray: that.data.ids,
            appId: app.globalData.userInfo.appid,
            appSecret: app.globalData.userInfo.secret,
            code: loginCode.code
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
              res.data[p].image = res.data[p].image ? util.api.imgUrl + res.data[p].image : ""
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
  },
  onLoad: function (e) {
    this.setData({
      ids: e.ids || 'b68e360b015f4a11b1cb93a98c3a8d8b,676d3c1863ca4e9584c829fd536cab6b,aa410b29a85f46a597d05dc78fc5c6c7',
      storeId: e.storeId||1,
      title: e.title||1,
      name:e.name||1
    })
    console.log(e)
    this.selected_goods();
  }
})
