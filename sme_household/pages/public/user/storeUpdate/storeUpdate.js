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
  address:function(){
    var that = this
    wx.chooseAddress({
      success: function (res) {
        var name = app.globalData.userIdentity !== 2 ? "storeInfo" :"userInfo";
        var param = {};
        param[name +'.address'] = res.detailInfo;
        param[name + '.contact'] = res.userName;
        param[name + '.region'] = res.provinceName + ',' + res.cityName + ',' + res.countyName;
        param[name + '.phone'] = res.telNumber;
        param['regobject.address'] = true;
        that.setData(param)
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
    if (name == "phone") {
      if (e.detail.value){
        boolean = reg.phone(e.detail.value);
      }
    } else if (name == "wechat"){
      boolean = reg.iSChinese(e.detail.value);
      if (e.detail.value.length < 6 && e.detail.value.length > 20){
        boolean = false
      }
    } else if (name == "cphone"){
      boolean = reg.tellphone(e.detail.value);
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
      } else if (!(target.phone && reg.phone(target.phone))) {
        this.setData({
          "regobject.phone": false
        })
      } else if (!(target.wechat.length >= 6 && target.wechat.length <= 20 && reg.iSChinese(target.wechat))) {
        this.setData({
          "regobject.wechat": false
        })
      } else if (!target.address) {
        this.setData({
          "regobject.address": false
        })
      } else {
        this.update_storeInfo(e)
      }
    }else{
      this.update_storeInfo(e)
    }
    
  },
  // 提交修改方法
  update_storeInfo: function (e) {
    var that = this;
    var object = e.detail.value;
    var objectSubmit = util.api.getEntityModified(this.data.originData, object);
    switch (app.globalData.userIdentity) {
      case 1:
        objectSubmit.storeId = app.globalData.storeId
        objectSubmit.type = 1;
        break;
      case 2:
        objectSubmit.userid = app.globalData.userid
        objectSubmit.type = 2
        break;
      case 3:
        objectSubmit.storeId = app.globalData.storeId
        break;
    }
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'user/saveUserOrStore',
      data: objectSubmit,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        app.globalData.userInfo.name = object.name || app.globalData.userInfo.name;
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
  bindChange: function (e) {
    var type = app.globalData.userIdentity !== 2 ? "storeInfo" :"userInfo";
    var name = e.target.dataset.name;
    var param = {};
    param['userInfo.' + name] = e.detail.value
    this.setData(param)
    console.log(param)
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
          param.originData = res.data;
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