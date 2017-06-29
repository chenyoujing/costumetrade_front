var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    countReview: 0,
    stordId: 1,
    id: 1,
    name: "",
    productReviews:[],
    pageNum:1
  },
  // 评论列表
  page_request: function () {
    var that = this;
    wx.showNavigationBarLoading()
    util.api.request({
      url: 'product/getReviews',
      data: {
        storeId: that.data.stordId,
        pageNum: that.data.pageNum,
        id: that.data.id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        for(var p in res.data){
          res.data[p].createtime = res.data[p].createtime ? util.toDate(res.data[p].createtime) : "";
        }
        that.setData({
          productReviews: res.data
        })
      }
    })
  },
  onLoad: function (e) {
    this.setData({
      countReview: e.comment,
      stordId: e.stordId,
      id: e.id,
      name: e.name
    })
    console.log(e.stordId)
    this.page_request()
  },
  onShow: function () {
  
  }
})