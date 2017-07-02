var util = require('../../../../utils/util.js')
var app = getApp()
Page({

  data: {
    date: '2016-09-01',
    storeInfo: [],
  },
  tx:function(){
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
      }
    })
  },
  address:function(){
    var that = this
    wx.chooseAddress({
      success: function (res) {
        that.setData({
          "storeInfo.address": res.detailInfo,
          "storeInfo.contact": res.userName,
          "storeInfo.region": res.provinceName + ',' + res.cityName + ',' + res.countyName,
          "storeInfo.phone": res.telNumber,
        })
        console.log(that.data.storeInfo)
      }
    })
  },
  update_storeInfo: function (e) {
    var that = this;
    e.detail.value.birthday = Date.parse(new Date(e.detail.value.birthday))
    var object = e.detail.value
    switch (app.globalData.userIdentity) {
      case 1:
        object.storeId = app.globalData.storeId
        object.type = 1;
        break;
      case 2:
        object.userid = app.globalData.userid
        object.type = 2
        break;
      case 3:
        object.storeId = app.globalData.storeId
        break;
    }
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'user/saveUserOrStore',
      data: object,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        if (app.globalData.userIdentity === 2) {
          var userInfo = app.globalData.userInfo
          userInfo.nickName = object.name
          userInfo.cphone = object.cphone
          userInfo.wechat = object.wechat
          userInfo.region = object.region
          userInfo.address = object.address
          userInfo.contact = object.contact
          userInfo.phone = object.phone
          userInfo.birthday = object.birthday
          app.globalData.userInfo = userInfo
        }else{
          var storeInfo = app.globalData.storeInfo[0]
          storeInfo.name = object.name
          storeInfo.cphone = object.cphone
          storeInfo.wechat = object.wechat
          storeInfo.region = object.region
          storeInfo.address = object.address
          storeInfo.contact = object.contact
          storeInfo.phone = object.phone
          storeInfo.birthday = object.birthday
          storeInfo.description = object.description
          app.globalData.storeInfo[0] = storeInfo
        }
        wx.showToast({
          title: '修改成功',
          mask: true,
          duration: 2000
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, 2000)
      }
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  onLoad: function (e) {
    console.log(app.globalData.storeInfo[0])
    var date
    if (app.globalData.storeInfo[0]){
      date = app.globalData.storeInfo[0].birthday
    } else if (app.globalData.userInfo){
      date = app.globalData.userInfo.birthday
    } else{
      date = '2016-09-01'
    }
    this.setData({
      storeInfo: app.globalData.storeInfo[0]||[],
      userInfo: app.globalData.userInfo,
      date: date,
      userIdentity: app.globalData.userIdentity,
    })
  }
})