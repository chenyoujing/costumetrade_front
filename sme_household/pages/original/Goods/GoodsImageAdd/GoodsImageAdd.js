var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
  
  },
  // 提交修改或新增货品
  submitGoodsInfo: function (e) {
    var that = this;
    var target = {};
    target.image = this.data.image;
    target.image1 = this.data.image1;
    target.image2 = this.data.image2;
    target.image3 = this.data.image3;
    target.image4 = this.data.image4;
    target.id = app.imageinfo.id;
    target.storeId = app.imageinfo.storeId;
    target[e.target.dataset.index] = app.imageinfo.image0;
    wx.showModal({
      title: '提示',
      content: '是否替换该图片',
      success: function (res) {
        if (res.confirm) {
          if (target !== null) {
            wx.showNavigationBarLoading()
            util.api.request({
              url: 'product/saveProduct',
              data: target,
              method: 'POST',
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                wx.hideNavigationBarLoading();
                wx.showToast({
                  title: '保存成功',
                  mask: true,
                  duration: 2000
                })
                wx.navigateBack({
                  delta: 2
                })
              }
            })
          } else {
            wx.showToast({
              title: '没有更改',
              mask: true,
              duration: 2000
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  onLoad: function (e) {
    this.setData({
      image: app.imageinfo.image,
      image1: app.imageinfo.image1,
      image2: app.imageinfo.image2,
      image3: app.imageinfo.image3,
      image4: app.imageinfo.image4,
    })
  },
})