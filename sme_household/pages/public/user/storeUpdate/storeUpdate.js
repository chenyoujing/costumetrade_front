var util = require('../../../../utils/util.js')
var reg = require('../../../../utils/reg.js')
var app = getApp()
Page({
  data: {
    date: '2016-09-01',
    storeInfo: [],
    regobject: {
    }
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
  // 正则验证
  reg: function (e) {
    var name = e.target.dataset.name;
    console.log(reg)
    var boolean = false;
    var regobject = "regobject." + name;
    var param = {};
    boolean = reg.iSnull(e.detail.value);
    if (name == "cphone") {
      boolean = reg.phone(e.detail.value);
    } else if (name == "wechat"){
      boolean = reg.iSChinese(e.detail.value);
      if (e.detail.value.length < 6){
        boolean = false
      }
    } 
    param[regobject] = boolean;
    this.setData(param)
  },
  // 提交之前的验证
  beforeSubmit:function(e){
    var target = e.detail.value
    var regobject = this.data.regobject
    //处理name 空size 空color
    if (app.globalData.userIdentity !== 2){
      if (!target.name) {
        var regobject = "regobject.name";
        this.setData({
          "regobject.name": false
        })
      } else if (!(target.cphone && reg.phone(target.cphone))) {
        this.setData({
          "regobject.cphone": false
        })
      } else if (!(20>=target.wechat.length>=6 && reg.iSChinese(target.wechat))) {
        this.setData({
          "regobject.wechat": false
        })
      } else if (!target.address) {
        this.setData({
          "regobject.address": false
        })
      } else {
        // this.update_storeInfo(e)
        console.log(1)
      }
    }else{
      this.update_storeInfo(e)
    }
    
  },
  // 提交修改方法
  update_storeInfo: function (e) {
    var that = this;
    // e.detail.value.birthday = Date.parse(new Date(e.detail.value.birthday))
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
        app.globalData.userInfo.name = object.name || app.globalData.userInfo.name;
        app.globalData.userInfo.photo = object.storephoto || app.globalData.userInfo.photo;
       
        // if (app.globalData.userIdentity == 2) {
        //   var userInfo = app.globalData.userInfo
        //   userInfo.name = object.name
        //   userInfo.avatarUrl = object.storephoto
        //   var reg = /^\//;
        //   if (reg.test(object.storephoto)) {
        //     userInfo.avatarUrl = util.api.imgUrl + object.storephoto
        //   }
        //   userInfo.cphone = object.cphone
        //   userInfo.wechat = object.wechat
        //   userInfo.region = object.region
        //   userInfo.address = object.address
        //   userInfo.contact = object.contact
        //   userInfo.phone = object.phone
        //   userInfo.birthday = util.formatTime(new Date(object.birthday))
        //   app.globalData.userInfo = userInfo
        // }else{
        //   var storeInfo = app.globalData.storeInfo[0]
        //   storeInfo.name = object.name
        //   var reg = /^\//;
        //   if (reg.test(object.storephoto)) {
        //     storeInfo.storephoto = util.api.imgUrl + object.storephoto
        //   }
        //   storeInfo.cphone = object.cphone
        //   storeInfo.wechat = object.wechat
        //   storeInfo.region = object.region
        //   storeInfo.address = object.address
        //   storeInfo.contact = object.contact
        //   storeInfo.phone = object.phone
        //   storeInfo.birthday = util.formatTime(new Date(object.birthday))
        //   storeInfo.description = object.description
        //   app.globalData.storeInfo[0] = storeInfo
        // }
        wx.showToast({
          title: '修改成功',
          mask: true,
          duration: 2000
        })
        setTimeout(() => {
          if (that.data.vipPlus){
            wx.redirectTo({
              url: '../../../shopkeeper/index/index',
            })
          }else{
            wx.navigateBack({
              delta: 1,
            })
          }
        }, 2000)
      }
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  // 更改标题
  changeTitle: function (){
    var that = this;
    wx.setNavigationBarTitle({
      title: '修改' + that.data.title
    })
  },
  // 请求店铺信息
  request_info: function () {
    var that = this
      wx.showNavigationBarLoading()
      util.api.request({
        url: 'store/getStore',
        data: that.data.getStoreFilter,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.hideNavigationBarLoading();
          var param = {};
        //   res.data.birthday = util.toDate(new Date(res.data.birthday))
        //   var reg = /^\//;
        //   if (reg.test(res.data.storephoto)) {
        //     res.data.storephoto = util.api.imgUrl + res.data.storephoto
        //   }
        //   that.setData({
        //     storeInfo: res.data
        //   })
        //   var images = app.globalData.storeInfo[0].images
        //   app.globalData.storeInfo[0] = res.data
        //   app.globalData.storeInfo[0].images = images
          res.data.birthday = res.data.birthday ? util.toDate(res.data.birthday) : util.toDate(new Date())

          if (app.globalData.userIdentity !== 2){
            param.storeInfo = res.data;
          }else{
            param.userInfo = res.data;
          }
          that.setData(param)
        }
      })
  },
  onLoad: function (e) {
    var getStoreFilter = app.globalData.userIdentity !== 2 ? { storeId: app.globalData.storeId } : { userId: app.globalData.userid }
    console.log(app.globalData.storeInfo[0])
    this.setData({
      vipPlus: e.vipPlus,
      title: app.globalData.userIdentity !== 2 ?'店铺信息':'个人信息',
      getStoreFilter: getStoreFilter,
      userIdentity: app.globalData.userIdentity,
    })
    this.changeTitle()
    this.request_info()
  }
})