var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    share_text:'',
    storeId:'',
    product:[],
    idArray:[],
    title:'',
    id:""
  },
  // 获取选中的货品
  selected_goods:function(){
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/enterShareProducts',
      data: {
        openid: app.globalData.openid,
        idArray: that.data.idArray,
        checkAllTag: that.data.checkAllTag,
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
  // 保存分享记录
  confirmShareProducts: function (id){
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/confirmShareProducts',
      data: {
        storeid: that.data.storeId,
        id: id,
        title: that.data.share_text,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        for (var p in res.data) {
          res.data[p].timeUp = util.toDate(res.data[p].timeUp)
          res.data[p].image = res.data[p].image ? util.api.imgUrl + res.data[p].image : ""
        }
        console.log(id)
        that.setData({
          product: res.data,
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
  
    var id = util.api.DateFormat(new Date())
    var that = this;
    var title = this.data.share_text;
    var ids = this.data.idArray;
    console.log(title)
    var storeId = this.data.storeId;
    if (!title){
      title = this.data.title+'的分享'
    }
    return {
      title: title,
      path: '/pages/index/index?ids=' + ids + '&storeId=' + storeId + "&title=" + title + '&name=' + this.data.title + '&checkAllTag=' + this.data.checkAllTag + '&id=' + id,
      success: function (res) {
        that.confirmShareProducts(id)
        wx.navigateBack({
          delta: 1,
        })
        console.log('/pages/index/index?ids=' + ids + '&storeId=' + storeId + "&title=" + title + '&name=' + that.data.title + '&checkAllTag=' + that.data.checkAllTag)
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onLoad: function (e) {
    this.setData({
      storeId: e.storeId,
      idArray: JSON.parse(e.ids),
      checkAllTag: e.checkAllTag,
      title: app.globalData.userInfo.name 
    })
    this.selected_goods()
  },
})