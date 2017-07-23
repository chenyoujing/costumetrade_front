var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    pay: '',
    orderno: '',
    buyerid: '',
    sellerid: '',
    payType: '',
    operate: '',
    imagePAy:""
  },
  // 获取支付信息
  enterPayInfo:function(){
    var that = this;
    wx.showNavigationBarLoading();
    util.api.request({
      url: 'order/enterPay',
      data: {
        storeId: that.data.sellerid
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(that.data.payType)
      
        for(var p in res.data){
          if (res.data[p].dictText.indexOf(that.data.payType) > -1){
            that.setData({
              imagePAy: res.data[p].dictValue
            })
          }
        }
        that.setData({
          bankPay: res.data[2].dictValue
        })
      }
    })
  },
  changeOrderStatus: function (e) {
    var that = this;
    var pay = e.currentTarget.dataset.pay;
    var content
    if(pay == 1){
      content = '我选择了不支付，确定？'
    } else if (pay == 2){
      content = '我已经支付过，确定？'
    }
    wx.showModal({
      title: '确定更改',
      content: content,
      success: function (res) {
        if (res.confirm) {
          that.surepay(e);
        }
      }
    })
  },
  // 确认已经付过款
  surepay:function(e){
    var that = this;
    var orderInfo = e.target.dataset;
    if (orderInfo.pay == "2") {
      app.payOrderno = this.data.orderno;
    }
    wx.showNavigationBarLoading();
    util.api.request({
      url: 'order/orderPay',
      data: {
        orderno: that.data.orderno,
        operate: 2,
        buyerid: that.data.buyerid,
        sellerid: that.data.sellerid,
        openid: app.globalData.openid,
        payable: that.data.pay,
        payStatus: orderInfo.pay,

      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.showToast({
          title: '成功',
          mask: true,
          duration: 2000
        })
        wx.navigateBack({
          delta: 2
        })
      }
    })
  },
  // 长按保存
  saveImage: function () {
    var that = this
    wx.showActionSheet({
      itemList: ['保存图片'],
      success: function (res) {
        if (res.tapIndex == 0) {
          var imagePAy = that.data.imagePAy
          if (imagePAy) {
            console.log(that.data.url + imagePAy)
            wx.downloadFile({
              url: that.data.url + imagePAy,
              success: function (res) {
                console.log(res)
                wx.saveImageToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success(res) {
                    wx.showToast({
                      title: '保存成功',
                    })
                  }
                })
              }
            })
          } else {
            wx.showToast({
              title: '没有可以保存的图片',
            })
          }
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      pay: options.pay,
      orderno: options.orderno,
      buyerid: options.buyerid,
      sellerid: options.sellerid,
      payType: options.payType,
      operate: options.operate,
      url: util.api.imgUrl,
      seller: options.sellername
    })
    this.enterPayInfo();
    console.log({
      pay: options.pay,
      orderno: options.orderno,
      buyerid: options.buyerid,
      sellerid: options.sellerid,
      payType: options.payType,
      operate: options.operate
    })
  }
})