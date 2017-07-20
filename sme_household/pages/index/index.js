
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
    product:[],
    id:''//分享的id
  },
  // 获取选中的货品
  selected_goods: function () {
    console.log(1111)
    var that = this;
    wx.login({
      success: function (loginCode) {
        console.log(1111)
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
                id:that.data.id
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                console.log(res.data)
                wx.hideNavigationBarLoading();
                for (var p in res.data) {
                  res.data[p].timeUp = util.toDate(res.data[p].timeUp);
                  res.data[p].image = util.api.imgUrl + res.data[p].image
                }
                that.setData({
                  product: res.data
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
      ids: JSON.parse(e.ids) ,
      storeId: e.storeId,
      title: e.title,
      name: e.name,
      checkAllTag: e.checkAllTag,
      id: e.id,
      photo: e.photo || '../../images/image_none.png'
    })
    console.log({
      ids: e.ids,
      storeId: e.storeId,
      title: e.title,
      name: e.name,
      checkAllTag: e.checkAllTag,
      id: e.id,
      photo: e.photo || '../../images/image_none.png'
    })
    util.api.getOpenid(this.selected_goods);
  }
})
