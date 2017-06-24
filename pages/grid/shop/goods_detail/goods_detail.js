var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    height: "",
    imgUrls: [
      '../../../../images/shop1_1.png',
      '../../../../images/shop1_2.png',
    ],
    infoid: "0",
    modal: "none",
    modal_opacity: "",
    modal_top: "100%",
    modal_bottom: "-100%",
    size: "1",
    sizes: "1",
    color: "1",
    id: "",
    title: "",
    stordId: 0
  },
  //请求并显示货品详情
  showGoodsInfo: function () {
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/getProductDetail',
      data: {
        storeId: that.data.stordId,
        id: that.data.id,
        openid: app.globalData.openid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        var typeName = '';
        var answerData = res.data;
        var imgUrls = that.data.imgUrls;
        answerData.timeDown = util.toDate(answerData.timeDown);
        answerData.timeUp = util.toDate(answerData.timeUp);
        imgUrls[0] = answerData.image ? util.api.imgUrl + answerData.image : '';
        imgUrls[1] = answerData.image1 ? util.api.imgUrl + answerData.image1 : '';
        imgUrls[2] = answerData.image2 ? util.api.imgUrl + answerData.image2 : '';
        imgUrls[3] = answerData.image3 ? util.api.imgUrl + answerData.image3 : '';
        imgUrls[4] = answerData.image4 ? util.api.imgUrl + answerData.image4 : '';
        answerData.video1 = answerData.video1 ? util.api.imgUrl + answerData.video1 : '';
        answerData.video2 = answerData.video2 ? util.api.imgUrl + answerData.video2 : '';
        answerData.video3 = answerData.video3 ? util.api.imgUrl + answerData.video3 : '';
        for (var p in app.screen_productTypeList) {
          if (app.screen_productTypeList[p].id == answerData.producttype) {
            typeName = app.screen_productTypeList[p].catename;
          }
        }
        answerData.producttype = typeName;
        that.setData({
          soruceData: util.api.Clone(answerData),
          GoodsInfoData: answerData,
          id: answerData.id
        });
      }
    })
  },
  onLoad: function (e) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      }
    })
    this.setData({
      id: e.ID,
      title: e.name,
      stordId: e.strod
    });
    this.showGoodsInfo();
    console.log({
      id: e.ID,
      title: e.name,
      stordId: e.strod
    })
  },
  detail_info: function (e) {
    let data = e.target.dataset
    this.setData({
      infoid: data.infoid
    })
  },
  detail_info_swiper: function (e) {
    this.setData({
      infoid: e.detail.current
    })
  },
  join: function (e) {
    var that = this
    let data = e.target.dataset
    wx.request({
      url: 'http://192.168.2.221:8088/product/takingStock',
      data: {
        storeId: data.storeid,
        id: data.id,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          product_upload: res.data.data,
        })
      }
    })
    this.setData({
      modal: "block",
    })
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(1).step()
    this.setData({
      modal_opacity: animation.export(),
      modal_top: "120rpx",
      modal_bottom: "0",
    })
  },
  modal_close: function () {
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    })
    animation.opacity(0).step()
    this.setData({
      modal_opacity: animation.export(),
      modal_top: "100%",
      modal_bottom: "-100%",
    })
    setTimeout(() => {
      this.setData({
        modal: "none",
      })
    }, 300)
  },
  sizes_checked: function (e) {
    let data = e.target.dataset
    this.setData({
      sizes: data.sizes,
    })
  },
  color_checked: function (e) {
    let data = e.target.dataset
    this.setData({
      color: data.color,
    })
  },
  size_checked: function (e) {
    let data = e.target.dataset
    this.setData({
      size: data.size,
    })
  },
  onShareAppMessage: function () {
    return {
      title: '我的转发',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

})