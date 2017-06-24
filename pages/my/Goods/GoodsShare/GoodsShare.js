var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    share_text:'',
    storeId:'',
    product:[],
    idArray:[],
    title:''
  },
  // 获取选中的货品
  selected_goods:function(ids,storeId){
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/getShareProduct',
      data: {
        storeId: storeId,
        idArray: ids
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        for (var p in res.data){
          res.data[p].timeUp = util.toDate(res.data[p].timeUp)
          res.data[p].image = res.data[p].image ? util.api.imgUrl + res.data[p].image : ""
        }
        that.setData({
          product: res.data
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
  onShareAppMessage: function (e) {
    var title = this.data.share_text;
    var ids = this.data.idArray;
    var storeId = this.data.storeId;
    if (!title){
      title = this.data.title+'的分享'
    }
    return {
      title: title,
      path: '/pages/index/index?ids=' + ids+ '&storeId=' + storeId+"&title="+title,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onLoad: function (e) {
    this.setData({
      storeId: e.storeId,
      idArray: e.ids,
      title: app.globalData.storeInfo[0].name
    })
    this.selected_goods(e.ids, e.storeId)
  },
})