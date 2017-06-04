var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    share_text:'',
    ids:'',
    storeId:'',
  },
  // 获取选中的货品
  selected_goods:function(ids,storeId){
    console.log(ids)
    console.log(storeId)
    this.setData({
      ids: ids,
      storeId: storeId,
    })
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/getProductDetail',
      data: {
        storeId: storeId,
        id: ids
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res.data)
        var product = that.data.product;
        for (var p in ids) {
          for (var j in product) {
            if (ids[p] = product[j].id) {
              product[j].splice(j, 1)
            }
          }
        }
        that.setData({
          product: product
        })
        wx.showToast({
          title: '成功',
          mask: true,
          duration: 2000
        })
      }
    })

  },
  share_text:function(e){
    this.setData({
      share_text: e.detail.value
    })
  },
  // 分享
  onShareAppMessage: function () {
    var title = this.data.share_text
    var ids = this.data.ids
    var storeId = this.data.storeId
    if (!title){
      title = 'XXX店铺的分享'
    }
    return {
      title: title,
      content:'sdfasfasdfsafsdafsadfasdf',
      describe:'sdfasfasdfsafsdafsadfasdf',
      bewrite:'sdfasfasdfsafsdafsadfasdf',
      path: '/pages/index/index?ids=' + ids + '&storeId=' + storeId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onLoad: function (e) {
    this.selected_goods(e.ids, e.storeId)
  },
})