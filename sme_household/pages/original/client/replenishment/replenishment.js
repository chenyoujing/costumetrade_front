var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    clientId: "",
    clientType: "",
    product:[],
    name: '',
    cate: ''
  },
  Replenishment_requst:function(){
    wx.showNavigationBarLoading()
    var that = this;
    util.api.request({
      url: 'client/clientReplenishment',
      data: {
        clientId: this.data.clientId,
        openid: app.globalData.openid,
        clientType: this.data.clientType
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideNavigationBarLoading();
        console.log(res.data)
        for(var p in res.data){
          res.data[p].image = util.api.imgUrl + res.data[p].image;
        }
        that.setData({
          product:res.data
        })
      }
    })
  },
  // 相应的跳转
  skipUrl:function(e){
    var id = e.target.dataset.goodsid;
    var storeId = e.target.dataset.storeid;
    var url = "";
    if (this.data.clientType == 1){
      url = "../../openOrder/openOrder?clientId=" + this.data.clientId + "&id=" + id+'&ClientData=true';
      app.selectName = e.target.dataset;
    }else{
      url = "../../../household/shop/goods_detail/goods_detail?clientId=" + this.data.clientId + "&ID=" + id + "&strod=" + storeId + '&ClientData=true'
    };
    console.log(e)
    wx.navigateTo({
      url: url
    })
  },
  onLoad: function (options) {
    this.setData({
      clientId: options.id,
      clientType: options.type,
      name: options.name,
      cate: options.cate,
      image: options.image
    })
    this.Replenishment_requst()
  },
  onShow: function () {
  
  }
})