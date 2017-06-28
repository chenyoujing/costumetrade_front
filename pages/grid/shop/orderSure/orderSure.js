var util = require('../../../../utils/util.js')
var app = getApp()
Page({
  data: {
    shopCart:[],
    totalPrice: 0,
    totalnum: 0,
    address:{},
    freight:10,
    expressModal:true
  },
  // 更改地址
  address:function(){
    wx.chooseAddress({
      success: function (res) {
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }
    })
  },
  // 请求默认
  orderInitAddress:function(){
      var that = this;
      wx.showNavigationBarLoading()
      util.api.request({
        url: 'order/orderInit',
        data: {
          openid: app.globalData.openid,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.hideNavigationBarLoading();
          that.setData({
            address:res.data
          })
          console.log(res)
        }
      })
  },
  orderSure:function(){
    var that = this;
    wx.showModal({
      title: '是否下订单',
      success: function (res) {
        if (res.confirm) {
          var submitData = {};
          var shopCart = that.data.shopCart;
          var newShopCart = [];
          submitData.stoDetails = [];
          submitData.order = {};
          submitData.order.ordertype = 1;
          submitData.order.realcostArray = that.data.totalPrice;
          submitData.openid = app.globalData.openid;
          for (var p in shopCart) {
            if (shopCart[p].productsize == '全尺码') {
              var sizeGroup = shopCart[p].sizeGroup.split(",");
              for (var g in sizeGroup) {
                newShopCart.push({
                  count: shopCart[p].count,
                  productname: shopCart[p].productName,
                  price: shopCart[p].sizeRaiseArray[g],
                  productid: shopCart[p].productid,
                  productunit: shopCart[p].productunit,
                  productcolor: shopCart[p].productcolor,
                  productsize: sizeGroup[g],
                  producttype: shopCart[p].producttype,
                  handtag: shopCart[p].handtag
                })
              }
            } else {
              newShopCart.push({
                count: shopCart[p].count,
                productname: shopCart[p].productName,
                price: shopCart[p].price,
                productid: shopCart[p].productid,
                productunit: shopCart[p].productunit,
                productcolor: shopCart[p].productcolor,
                productsize: shopCart[p].productsize,
                producttype: shopCart[p].producttype,
                handtag: shopCart[p].handtag
              })
            }
          }
          submitData.stoDetails = newShopCart;
          console.log(submitData)
          that.submitData(submitData);
        }
      }
    })
  },
  // 得到缓存本地数据
  getData: function () {
    var that = this;
    var name = 'shopCartUp' + this.data.stordId;
    var selectCart = []
    wx.getStorage({
      key: name,
      complete: function (res) {
        res.data = res.data ? res.data : [];
        for(var p in res.data){
          if (res.data[p].iSselect == true){
            selectCart.push(res.data[p])
          }
        }
        that.setData({
          shopCart: selectCart
        })
      }
    })
  },
  // 提交数据
  submitData: function (submitData){
      var that = this;
      wx.showNavigationBarLoading()
      util.api.request({
        url: 'order/saveOrders',
        data: submitData,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideNavigationBarLoading();
          if(res.data == 1013){
            wx.showModal({
              title: '提示',
              content: '缺少库存,是否继续操作?',
              success: function (res) {
                if (res.confirm) {
                  submitData.isContinue = true;
                  that.ajaxChange(submitData);
                }
              }
            })
          } else if (res.data == 1020){
            wx.showToast({
              title: '自家店铺不能下单',
            })
          }else{
            wx.showToast({
              title: '下单成功',
            })
          }
        }
      })
   },
// 删除
  onLoad: function (options) {
    this.setData({
      stordId: options.stordId,
      totalPrice: options.totalPrice,
      totalnum: options.totalnum
    })
    this.orderInitAddress();
    this.getData()
  }
})