// pages/grid/order/express/express.js
Page({
  data: {
    title:"快递单"
  },
  expressSubmit:function(e){
    var that = this;
    var object = e.detail.value 
    console.log(object)
    // wx.showNavigationBarLoading();
    // util.api.request({
    //   url: 'logistic/orderSF',
    //   data: {
    //   },
    //   method: 'POST',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   success: function (res) {
    //     wx.hideNavigationBarLoading();
    //   }
    // })
  },
})