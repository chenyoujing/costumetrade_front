var util = require('../../../../utils/util.js')
var app = getApp()
Page({

  data: {
    date: '2016-09-01',
    storeInfo: [],
  },
  // 上传图片
  photoSubmit: function (file, i) {
    var that = this;
    wx.uploadFile({
      url: util.api.host + 'product/uploadImage',
      filePath: file[i],
      name: 'file',
      success: function (res) {
        if (JSON.parse(res.data).code == 0) {
          var url = util.api.imgUrl + JSON.parse(res.data).data.url;
          that.setData({
            tx: url,
            storephoto: JSON.parse(res.data).data.url,
          })
          wx.showToast({
            title: '上传成功',
            mask: true,
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '失败',
            mask: true,
            duration: 2000
          })
        }

      }
    })
  },
  // 上传图片
  imageCallback: function (e, res) {
    var tempFilePaths = res.tempFilePaths;
    this.photoSubmit(tempFilePaths, 0);
  },
  tx:function(e){
    util.api.chooseImg(e, this.imageCallback)    
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
        if (app.globalData.userIdentity == 2) {
          var userInfo = app.globalData.userInfo
          userInfo.name = object.name
          userInfo.avatarUrl = object.storephoto
          var reg = /^\//;
          if (reg.test(object.storephoto)) {
            userInfo.avatarUrl = util.api.imgUrl + object.storephoto
          }
          userInfo.cphone = object.cphone
          userInfo.wechat = object.wechat
          userInfo.region = object.region
          userInfo.address = object.address
          userInfo.contact = object.contact
          userInfo.phone = object.phone
          userInfo.birthday = util.formatTime(new Date(object.birthday))
          app.globalData.userInfo = userInfo
        }else{
          var storeInfo = app.globalData.storeInfo[0]
          storeInfo.name = object.name
          var reg = /^\//;
          if (reg.test(object.storephoto)) {
            storeInfo.storephoto = util.api.imgUrl + object.storephoto
          }
          storeInfo.cphone = object.cphone
          storeInfo.wechat = object.wechat
          storeInfo.region = object.region
          storeInfo.address = object.address
          storeInfo.contact = object.contact
          storeInfo.phone = object.phone
          storeInfo.birthday = util.formatTime(new Date(object.birthday))
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
  // 请求店铺信息
  request_page: function () {
    var that = this
    if (app.globalData.storeInfo[0]) {
      wx.showNavigationBarLoading()
      util.api.request({
        url: 'store/getStore',
        data: {
          storeId: app.globalData.storeId,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.hideNavigationBarLoading();
          res.data.birthday = util.toDate(new Date(res.data.birthday))
          var reg = /^\//;
          if (reg.test(res.data.storephoto)) {
            res.data.storephoto = util.api.imgUrl + res.data.storephoto
          }
          that.setData({
            storeInfo: res.data
          })
          var images = app.globalData.storeInfo[0].images
          app.globalData.storeInfo[0] = res.data
          app.globalData.storeInfo[0].images = images
        }
      })
    }
  },
  onLoad: function (e) {
    console.log(app.globalData.storeInfo[0])
    var date
    if (app.globalData.storeInfo[0]){
      date = app.globalData.storeInfo[0].birthday
    } else if (app.globalData.myInfo){
      date = app.globalData.myInfo.birthday
    } else{
      date = '2016-09-01'
    }
    this.setData({
      storeInfo:app.globalData.userIdentity !== 2?app.globalData.storeInfo[0]:[],
      userInfo: app.globalData.myInfo,
      date: date,
      userIdentity: app.globalData.userIdentity,
    })
    this.request_page()
  }
})