import socket from '../../../utils/socket.js'
var util = require('../../../utils/util.js')
var app = getApp()
Page({
  data: {
    imgUrls: [
      '../../../images/swiper1.jpg',
      '../../../images/swiper2.jpg',
    ],
    otherStord:true,
    pageNum:1,
    loadMore: false,
    requestSwitch: false
  },
  goto_info:function(e){
    app.infotype = e.target.dataset.infotype
    wx.switchTab({
      url: '../info/info',
    })
  },
  // 初始化数据
  // initialize:function(){
    // for (var p in app.globalData.storeInfo){
    //   var reg = /^\//;
    //   if (reg.test(app.globalData.storeInfo[p].storephoto)) {
    //     app.globalData.storeInfo[p].storephoto = util.api.imgUrl + app.globalData.storeInfo[p].storephoto
    //   }   
    // }
    // var otherStord = app.globalData.storeInfo;
    // this.setData({
    //   otherStord: otherStord
    // })
  // },
  // 店主的时候请求店铺列表
  getAllPromotionalProduct:function(){
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/getGroupPromotionalProduct',
      data: {
       openid:app.globalData.openid,
       pageNum: that.data.pageNum
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var data = that.data.pageNum == 1?[]:that.data.otherStord;
        var booleanre = that.data.requestSwitch;
        res.data = res.data == 1000 ? [] : res.data;
        for (var p in res.data) {
          res.data[p].images = res.data[p].productImages.split(',');
          res.data[p].createTime = util.toDate(res.data[p].createTime)
          data.push(res.data[p])
        }
        if (res.data.length < 10) {
          booleanre = false;
        } else {
          booleanre = true;
        }
        that.setData({
          otherStord: data || false,
          loadMore: true,
          requestSwitch: booleanre
        })
      }
    })
  },
  //滚动到底部触发事件  
  onReachBottom: function () {
    console.log('到底不了')
    this.setData({
      pageNum: this.data.pageNum + 1,
      loadMore: false
    });
    console.log(this.data.pageNum)
    if (this.data.requestSwitch) {
      this.page_request();
    }
  },
  // 登录接口使用
  callback: function () {
    if (app.globalData.userIdentity !== 2) {
      util.api.getProductInit(this.getAllPromotionalProduct);
    }
  },
  // 登录失败
  fail: function () {
    var that = this
    wx.showModal({
      title: '登录失败',
      cancelText: '确认',
      confirmText: '重新登录',
      success: function () {
        if (res.confirm) {
          that.onLoad()
        }
      }
    })
  },
  onLoad:function(e){
    if (!app.globalData.openid){
      util.api.getOpenid(this.callback, this.fail);
    }else{
      this.getAllPromotionalProduct()
    }
    this.setData({
      url: util.api.imgUrl,
      shopkeeper: e.shopkeeper,
    })
    
    // if (!app.globalData.openid){
    //   util.api.getOpenid(this.initialize);
    // }else{
      // this.initialize()
    // }
    // if (!app.logisticFees && app.globalData.userIdentity!==2) {
    //   util.api.getProductInit()
    // }
    // this.getAllPromotionalProduct()
    wx.updateShareMenu({
      withShareTicket: true,
      success() {
      }
    })
  },
  // 店主请求图片列表
  onShow:function(){
    
  },
  onShareAppMessage: function () {
    return {
      title: '自定义转发标题',
      path: '/pages/index/index?id=我传的东西',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})